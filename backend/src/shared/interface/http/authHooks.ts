import type { FastifyReply, FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../../domain/errors';

export interface AuthUser {
  id: string;
  email: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email: string };
    user: AuthUser;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser;
  }
}

/**
 * RBAC seam for later phases. Currently a no-op that always allows.
 * Replace with permission checks against Role/Permission tables.
 */
export async function authorize(
  _request: FastifyRequest,
  _reply: FastifyReply,
  _permission?: string,
): Promise<void> {
  // intentionally empty
}

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  try {
    const payload = await request.jwtVerify<{ sub: string; email: string }>();
    request.user = { id: payload.sub, email: payload.email };
  } catch {
    throw new UnauthorizedError('Invalid or missing access token');
  }
}
