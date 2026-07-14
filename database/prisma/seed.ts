import { hash } from 'argon2';
import {
  PrismaClient,
  type CustomFieldType,
  type ProjectViewType,
} from '../generated/client';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@smartwork.local';
const ADMIN_PASSWORD = 'Admin123!';

type TemplateDef = {
  key: string;
  name: string;
  department: string;
  description: string;
  statuses: { name: string; color: string; isDone?: boolean }[];
  sections: string[];
  tags: { name: string; color: string }[];
  views: ProjectViewType[];
  customFields: { name: string; key: string; type: CustomFieldType }[];
};

const TEMPLATES: TemplateDef[] = [
  {
    key: 'software_development',
    name: 'Software Development',
    department: 'Engineering',
    description: 'Backlog-driven engineering workflow',
    statuses: [
      { name: 'Backlog', color: '#94A3B8' },
      { name: 'Todo', color: '#60A5FA' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Code Review', color: '#A78BFA' },
      { name: 'Testing', color: '#F472B6' },
      { name: 'Done', color: '#22C55E', isDone: true },
    ],
    sections: ['Backlog', 'Sprint Planning', 'Sprint', 'QA', 'Done'],
    tags: [
      { name: 'bug', color: '#EF4444' },
      { name: 'feature', color: '#3B82F6' },
      { name: 'tech-debt', color: '#F59E0B' },
    ],
    views: ['BACKLOG', 'KANBAN', 'LIST'],
    customFields: [
      { name: 'Story Points', key: 'story_points', type: 'NUMBER' },
      { name: 'Sprint', key: 'sprint', type: 'TEXT' },
      { name: 'Component', key: 'component', type: 'DROPDOWN' },
    ],
  },
  {
    key: 'marketing',
    name: 'Marketing',
    department: 'Marketing',
    description: 'Campaign and content workflow',
    statuses: [
      { name: 'Ideas', color: '#94A3B8' },
      { name: 'Planning', color: '#60A5FA' },
      { name: 'Design', color: '#A78BFA' },
      { name: 'Content Creation', color: '#F59E0B' },
      { name: 'Review', color: '#F472B6' },
      { name: 'Scheduled', color: '#38BDF8' },
      { name: 'Published', color: '#22C55E' },
      { name: 'Completed', color: '#16A34A', isDone: true },
    ],
    sections: ['Ideas', 'Active Campaigns', 'Review', 'Published'],
    tags: [
      { name: 'campaign', color: '#8B5CF6' },
      { name: 'social', color: '#06B6D4' },
    ],
    views: ['KANBAN', 'LIST', 'CALENDAR'],
    customFields: [
      { name: 'Campaign', key: 'campaign', type: 'TEXT' },
      { name: 'Channel', key: 'channel', type: 'DROPDOWN' },
      { name: 'Budget', key: 'budget', type: 'CURRENCY' },
    ],
  },
  {
    key: 'sales',
    name: 'Sales',
    department: 'Sales',
    description: 'Pipeline and deal workflow',
    statuses: [
      { name: 'Lead', color: '#94A3B8' },
      { name: 'Contacted', color: '#60A5FA' },
      { name: 'Qualified', color: '#38BDF8' },
      { name: 'Proposal Sent', color: '#A78BFA' },
      { name: 'Negotiation', color: '#F59E0B' },
      { name: 'Won', color: '#22C55E', isDone: true },
      { name: 'Lost', color: '#EF4444', isDone: true },
    ],
    sections: ['Prospects', 'Active Deals', 'Follow Up', 'Closed'],
    tags: [{ name: 'enterprise', color: '#1D4ED8' }],
    views: ['KANBAN', 'TABLE', 'DASHBOARD'],
    customFields: [
      { name: 'Customer', key: 'customer', type: 'TEXT' },
      { name: 'Deal Value', key: 'deal_value', type: 'CURRENCY' },
    ],
  },
  {
    key: 'hr',
    name: 'HR',
    department: 'HR',
    description: 'Recruitment and onboarding',
    statuses: [
      { name: 'Open Position', color: '#94A3B8' },
      { name: 'Candidate Sourcing', color: '#60A5FA' },
      { name: 'Screening', color: '#38BDF8' },
      { name: 'Interview', color: '#A78BFA' },
      { name: 'Assessment', color: '#F59E0B' },
      { name: 'Offer', color: '#F472B6' },
      { name: 'Hired', color: '#22C55E', isDone: true },
      { name: 'Rejected', color: '#EF4444', isDone: true },
      { name: 'Onboarding', color: '#14B8A6' },
    ],
    sections: ['Recruitment', 'Interviews', 'Hiring', 'Onboarding'],
    tags: [{ name: 'urgent', color: '#EF4444' }],
    views: ['KANBAN', 'LIST'],
    customFields: [
      { name: 'Candidate', key: 'candidate', type: 'TEXT' },
      { name: 'Department', key: 'department', type: 'DROPDOWN' },
    ],
  },
  {
    key: 'customer_support',
    name: 'Customer Support',
    department: 'Customer Support',
    description: 'Ticket lifecycle',
    statuses: [
      { name: 'New', color: '#94A3B8' },
      { name: 'Assigned', color: '#60A5FA' },
      { name: 'Investigating', color: '#F59E0B' },
      { name: 'Waiting for Customer', color: '#F472B6' },
      { name: 'Resolved', color: '#22C55E' },
      { name: 'Closed', color: '#16A34A', isDone: true },
    ],
    sections: ['Inbox', 'In Progress', 'Waiting', 'Resolved'],
    tags: [{ name: 'billing', color: '#F59E0B' }],
    views: ['LIST', 'KANBAN'],
    customFields: [{ name: 'Ticket Severity', key: 'severity', type: 'DROPDOWN' }],
  },
  {
    key: 'finance',
    name: 'Finance',
    department: 'Finance',
    description: 'Request and approval workflow',
    statuses: [
      { name: 'Requested', color: '#94A3B8' },
      { name: 'Pending Approval', color: '#F59E0B' },
      { name: 'Approved', color: '#60A5FA' },
      { name: 'Processing', color: '#A78BFA' },
      { name: 'Completed', color: '#22C55E', isDone: true },
      { name: 'Rejected', color: '#EF4444', isDone: true },
    ],
    sections: ['Requests', 'Approvals', 'Processing', 'Closed'],
    tags: [{ name: 'expense', color: '#10B981' }],
    views: ['LIST', 'TABLE'],
    customFields: [{ name: 'Amount', key: 'amount', type: 'CURRENCY' }],
  },
  {
    key: 'operations',
    name: 'Operations',
    department: 'Operations',
    description: 'Operational work tracking',
    statuses: [
      { name: 'Planned', color: '#94A3B8' },
      { name: 'In Progress', color: '#F59E0B' },
      { name: 'Blocked', color: '#EF4444' },
      { name: 'Review', color: '#A78BFA' },
      { name: 'Completed', color: '#22C55E', isDone: true },
      { name: 'Cancelled', color: '#6B7280', isDone: true },
    ],
    sections: ['Planned', 'Active', 'Blocked', 'Done'],
    tags: [{ name: 'facilities', color: '#78716C' }],
    views: ['KANBAN', 'LIST'],
    customFields: [{ name: 'Owner Team', key: 'owner_team', type: 'TEXT' }],
  },
  {
    key: 'product_management',
    name: 'Product Management',
    department: 'Product',
    description: 'Idea to release workflow',
    statuses: [
      { name: 'Idea', color: '#94A3B8' },
      { name: 'Research', color: '#60A5FA' },
      { name: 'Planned', color: '#38BDF8' },
      { name: 'In Development', color: '#F59E0B' },
      { name: 'Validation', color: '#A78BFA' },
      { name: 'Released', color: '#22C55E' },
      { name: 'Completed', color: '#16A34A', isDone: true },
    ],
    sections: ['Discovery', 'Delivery', 'Validation', 'Shipped'],
    tags: [{ name: 'platform', color: '#1D4ED8' }],
    views: ['BACKLOG', 'KANBAN', 'TIMELINE'],
    customFields: [
      { name: 'Impact', key: 'impact', type: 'RATING' },
      { name: 'Effort', key: 'effort', type: 'NUMBER' },
    ],
  },
  {
    key: 'blank',
    name: 'Blank Project',
    department: 'General',
    description: 'Empty workflow — configure from scratch',
    statuses: [],
    sections: ['General'],
    tags: [],
    views: ['LIST', 'BACKLOG'],
    customFields: [],
  },
];

async function upsertTemplates() {
  for (const tpl of TEMPLATES) {
    await prisma.projectTemplate.upsert({
      where: { key: tpl.key },
      update: {
        name: tpl.name,
        description: tpl.description,
        department: tpl.department,
        recommendedViews: tpl.views,
        defaultSections: tpl.sections,
        suggestedTags: tpl.tags,
        defaultCustomFields: tpl.customFields,
        workflowStatuses: tpl.statuses,
      },
      create: {
        key: tpl.key,
        name: tpl.name,
        description: tpl.description,
        department: tpl.department,
        recommendedViews: tpl.views,
        defaultSections: tpl.sections,
        suggestedTags: tpl.tags,
        defaultCustomFields: tpl.customFields,
        workflowStatuses: tpl.statuses,
      },
    });
  }
}

async function applyTemplateToProject(
  projectId: string,
  templateKey: string,
  adminId: string,
) {
  const tpl = TEMPLATES.find((t) => t.key === templateKey)!;
  const template = await prisma.projectTemplate.findUniqueOrThrow({
    where: { key: templateKey },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { templateId: template.id },
  });

  let workflow = await prisma.workflow.findUnique({ where: { projectId } });
  if (!workflow) {
    workflow = await prisma.workflow.create({
      data: { projectId, name: `${tpl.name} Workflow` },
    });
  }

  const statusCount = await prisma.workflowStatus.count({
    where: { workflowId: workflow.id, deletedAt: null },
  });
  if (statusCount === 0) {
    const statuses =
      tpl.statuses.length > 0
        ? tpl.statuses
        : [{ name: 'Open', color: '#6B7280' }];
    await prisma.workflowStatus.createMany({
      data: statuses.map((s, i) => ({
        workflowId: workflow!.id,
        name: s.name,
        color: s.color,
        sortOrder: i,
        isDone: Boolean(s.isDone),
      })),
    });
  }

  const statuses = await prisma.workflowStatus.findMany({
    where: { workflowId: workflow.id, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });

  if (
    (await prisma.section.count({ where: { projectId, deletedAt: null } })) === 0
  ) {
    await prisma.section.createMany({
      data: tpl.sections.map((name, i) => ({
        projectId,
        name,
        sortOrder: i,
      })),
    });
  }
  const sections = await prisma.section.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });

  for (const tag of tpl.tags) {
    await prisma.tag.upsert({
      where: { projectId_name: { projectId, name: tag.name } },
      update: { color: tag.color },
      create: { projectId, name: tag.name, color: tag.color },
    });
  }

  for (const [i, field] of tpl.customFields.entries()) {
    await prisma.customField.upsert({
      where: { projectId_key: { projectId, key: field.key } },
      update: { name: field.name, type: field.type, sortOrder: i },
      create: {
        projectId,
        name: field.name,
        key: field.key,
        type: field.type,
        sortOrder: i,
        options: field.type === 'DROPDOWN' ? ['Option A', 'Option B'] : [],
      },
    });
  }

  if ((await prisma.task.count({ where: { projectId, deletedAt: null } })) === 0) {
    const sampleTasks = [
      'Set up CI pipeline',
      'Implement auth middleware',
      'Write API contract tests',
    ];
    for (const [i, title] of sampleTasks.entries()) {
      const parent = await prisma.task.create({
        data: {
          projectId,
          sectionId: sections[0]?.id,
          statusId: statuses[0]?.id,
          title,
          description: `## ${title}\n\nSeeded demo task.`,
          priority: i === 0 ? 'HIGH' : 'MEDIUM',
          assigneeId: adminId,
          reporterId: adminId,
          sortOrder: i,
        },
      });
      if (i === 0) {
        await prisma.task.create({
          data: {
            projectId,
            sectionId: sections[0]?.id,
            statusId: statuses[0]?.id,
            parentTaskId: parent.id,
            title: `Subtask: research for ${title}`,
            priority: 'LOW',
            reporterId: adminId,
            sortOrder: 0,
          },
        });
        await prisma.comment.create({
          data: {
            taskId: parent.id,
            authorId: adminId,
            body: 'Seeded comment — kickoff notes.',
          },
        });
        await prisma.activityHistory.create({
          data: {
            taskId: parent.id,
            actorId: adminId,
            action: 'CREATED',
            entityType: 'Task',
            entityId: parent.id,
            metadata: { source: 'seed' },
          },
        });
      }
    }
  }
}

async function main() {
  console.log('Seeding...');
  await upsertTemplates();

  const passwordHash = await hash(ADMIN_PASSWORD);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      displayName: 'Admin User',
      passwordHash,
      deletedAt: null,
    },
    create: {
      email: ADMIN_EMAIL,
      displayName: 'Admin User',
      passwordHash,
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: { name: 'Demo Organization', deletedAt: null },
    create: { name: 'Demo Organization', slug: 'demo-org' },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: org.id, userId: admin.id },
    },
    update: {},
    create: { organizationId: org.id, userId: admin.id },
  });

  const workspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: { organizationId: org.id, slug: 'demo-workspace' },
    },
    update: { name: 'Demo Workspace', deletedAt: null },
    create: {
      organizationId: org.id,
      name: 'Demo Workspace',
      slug: 'demo-workspace',
    },
  });

  const marketingWorkspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: org.id,
        slug: 'marketing-workspace',
      },
    },
    update: { name: 'Marketing Workspace', deletedAt: null },
    create: {
      organizationId: org.id,
      name: 'Marketing Workspace',
      slug: 'marketing-workspace',
    },
  });

  let project = await prisma.project.findFirst({
    where: { workspaceId: workspace.id, key: 'SWENG', deletedAt: null },
  });
  if (!project) {
    project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        name: 'Software Engineering Demo',
        key: 'SWENG',
        description: 'Primary seeded project',
        lastViewType: 'BACKLOG',
        isFavorite: true,
      },
    });
  }

  let marketingProject = await prisma.project.findFirst({
    where: {
      workspaceId: marketingWorkspace.id,
      key: 'MKTG',
      deletedAt: null,
    },
  });
  if (!marketingProject) {
    marketingProject = await prisma.project.create({
      data: {
        workspaceId: marketingWorkspace.id,
        name: 'Brand Campaigns',
        key: 'MKTG',
        description: 'Seeded marketing project for workspace switching',
        lastViewType: 'KANBAN',
      },
    });
  }

  await applyTemplateToProject(project.id, 'software_development', admin.id);
  await applyTemplateToProject(marketingProject.id, 'marketing', admin.id);

  const partnerOrg = await prisma.organization.upsert({
    where: { slug: 'partner-org' },
    update: { name: 'Partner Organization', deletedAt: null },
    create: { name: 'Partner Organization', slug: 'partner-org' },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: partnerOrg.id,
        userId: admin.id,
      },
    },
    update: {},
    create: { organizationId: partnerOrg.id, userId: admin.id },
  });

  const partnerWorkspace = await prisma.workspace.upsert({
    where: {
      organizationId_slug: {
        organizationId: partnerOrg.id,
        slug: 'partner-workspace',
      },
    },
    update: { name: 'Partner Workspace', deletedAt: null },
    create: {
      organizationId: partnerOrg.id,
      name: 'Partner Workspace',
      slug: 'partner-workspace',
    },
  });

  let partnerProject = await prisma.project.findFirst({
    where: {
      workspaceId: partnerWorkspace.id,
      key: 'OPS',
      deletedAt: null,
    },
  });
  if (!partnerProject) {
    partnerProject = await prisma.project.create({
      data: {
        workspaceId: partnerWorkspace.id,
        name: 'Partner Operations',
        key: 'OPS',
        description: 'Seeded project for organization switching',
        lastViewType: 'LIST',
      },
    });
  }
  await applyTemplateToProject(partnerProject.id, 'operations', admin.id);

  console.log('Seed complete.');
  console.log(`  Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  Org: ${org.slug}`);
  console.log(`  Workspace: ${workspace.slug}  Project: ${project.key}`);
  console.log(
    `  Workspace: ${marketingWorkspace.slug}  Project: ${marketingProject.key}`,
  );
  console.log(
    `  Org: ${partnerOrg.slug}  Workspace: ${partnerWorkspace.slug}  Project: ${partnerProject.key}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
