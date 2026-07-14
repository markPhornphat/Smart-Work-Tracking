import { createHash, randomBytes } from 'node:crypto';
import { hash, verify } from 'argon2';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../shared/infrastructure/database/prisma';
import { env } from '../../shared/infrastructure/config/env';
import { DomainError, UnauthorizedError } from '../../shared/domain/errors';
import { authenticate } from '../../shared/interface/http/authHooks';

function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function parseDurationMs(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl);
  if (!match) return 15 * 60 * 1000;
  const n = Number(match[1]);
  const unit = match[2];
  const map: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * map[unit];
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).optional(),
});

async function issueTokens(app: FastifyInstance, user: { id: string; email: string }) {
  const accessToken = await app.jwt.sign(
    { sub: user.id, email: user.email },
    { expiresIn: env.JWT_ACCESS_TTL },
  );
  const refreshToken = randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + parseDurationMs(env.JWT_REFRESH_TTL));
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt,
    },
  });
  return { accessToken, refreshToken, expiresAt };
}

function toPublicUser(user: {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/v1/auth/register', async (request, reply) => {
    const body = credentialsSchema.parse(request.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing && !existing.deletedAt) {
      throw new DomainError('Email already registered', 'EMAIL_TAKEN');
    }

    const passwordHash = await hash(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        displayName: body.displayName?.trim() || body.email.split('@')[0],
        passwordHash,
      },
    });

    const tokens = await issueTokens(app, user);
    return reply.status(201).send({ user: toPublicUser(user), ...tokens });
  });

  app.post('/api/v1/auth/login', async (request) => {
    const body = credentialsSchema.omit({ displayName: true }).parse(request.body);
    const user = await prisma.user.findFirst({
      where: { email: body.email.toLowerCase(), deletedAt: null },
    });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const ok = await verify(user.passwordHash, body.password);
    if (!ok) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const tokens = await issueTokens(app, user);
    return { user: toPublicUser(user), ...tokens };
  });

  app.post('/api/v1/auth/refresh', async (request) => {
    const body = z.object({ refreshToken: z.string().min(20) }).parse(request.body);
    const tokenHash = hashRefreshToken(body.refreshToken);
    const stored = await prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
      include: { user: true },
    });
    if (!stored || stored.expiresAt < new Date() || stored.user.deletedAt) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
    const tokens = await issueTokens(app, stored.user);
    return { user: toPublicUser(stored.user), ...tokens };
  });

  app.post('/api/v1/auth/logout', { preHandler: [authenticate] }, async (request) => {
    const body = z.object({ refreshToken: z.string().optional() }).parse(request.body ?? {});
    if (body.refreshToken) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: request.user.id,
          tokenHash: hashRefreshToken(body.refreshToken),
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    } else {
      await prisma.refreshToken.updateMany({
        where: { userId: request.user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { ok: true };
  });

  app.get('/api/v1/auth/me', { preHandler: [authenticate] }, async (request) => {
    const user = await prisma.user.findFirst({
      where: { id: request.user.id, deletedAt: null },
    });
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    return { user: toPublicUser(user) };
  });
}
