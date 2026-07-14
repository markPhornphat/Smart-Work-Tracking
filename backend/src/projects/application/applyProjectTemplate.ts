import type { Prisma } from '@smart-work-tracking/database';
import { prisma } from '../../shared/infrastructure/database/prisma';
import { NotFoundError } from '../../shared/domain/errors';

type TemplateJson = {
  statuses?: { name: string; color: string; isDone?: boolean }[];
  sections?: string[];
  tags?: { name: string; color: string }[];
  customFields?: { name: string; key: string; type: string }[];
  views?: string[];
};

export async function applyProjectTemplate(projectId: string, templateKey: string) {
  const template = await prisma.projectTemplate.findFirst({
    where: { key: templateKey, deletedAt: null },
  });
  if (!template) {
    throw new NotFoundError('ProjectTemplate', templateKey);
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      templateId: template.id,
      lastViewType: ((template.recommendedViews as string[])?.[0] as never) ?? 'BACKLOG',
    },
  });

  const statuses = (template.workflowStatuses as TemplateJson['statuses']) ?? [];
  const sections = (template.defaultSections as TemplateJson['sections']) ?? [];
  const tags = (template.suggestedTags as TemplateJson['tags']) ?? [];
  const fields = (template.defaultCustomFields as TemplateJson['customFields']) ?? [];

  const workflow = await prisma.workflow.upsert({
    where: { projectId },
    update: { name: `${template.name} Workflow` },
    create: { projectId, name: `${template.name} Workflow` },
  });

  await prisma.workflowStatus.deleteMany({ where: { workflowId: workflow.id } });
  const statusRows =
    statuses.length > 0 ? statuses : [{ name: 'Open', color: '#6B7280' }];
  await prisma.workflowStatus.createMany({
    data: statusRows.map((s, i) => ({
      workflowId: workflow.id,
      name: s.name,
      color: s.color,
      sortOrder: i,
      isDone: Boolean(s.isDone),
    })),
  });

  await prisma.section.deleteMany({ where: { projectId } });
  if (sections.length) {
    await prisma.section.createMany({
      data: sections.map((name, i) => ({ projectId, name, sortOrder: i })),
    });
  }

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { projectId_name: { projectId, name: tag.name } },
      update: { color: tag.color, deletedAt: null },
      create: { projectId, name: tag.name, color: tag.color },
    });
  }

  for (const [i, field] of fields.entries()) {
    await prisma.customField.upsert({
      where: { projectId_key: { projectId, key: field.key } },
      update: {
        name: field.name,
        type: field.type as never,
        sortOrder: i,
        deletedAt: null,
      },
      create: {
        projectId,
        name: field.name,
        key: field.key,
        type: field.type as never,
        sortOrder: i,
        options: [] as Prisma.InputJsonValue,
      },
    });
  }

  return workflow;
}
