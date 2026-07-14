import { prisma } from '../infrastructure/database/prisma';
import { ForbiddenError, NotFoundError } from '../domain/errors';

export async function assertOrgMember(userId: string, organizationId: string): Promise<void> {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: { organizationId, userId },
    },
  });
  if (!membership) {
    throw new ForbiddenError('Not a member of this organization');
  }
}

export async function assertWorkspaceAccess(userId: string, workspaceId: string) {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, deletedAt: null },
  });
  if (!workspace) {
    throw new NotFoundError('Workspace', workspaceId);
  }
  await assertOrgMember(userId, workspace.organizationId);
  return workspace;
}

export async function assertProjectAccess(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, deletedAt: null },
    include: { workspace: true },
  });
  if (!project) {
    throw new NotFoundError('Project', projectId);
  }
  await assertOrgMember(userId, project.workspace.organizationId);
  return project;
}
