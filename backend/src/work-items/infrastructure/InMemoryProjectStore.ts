import type { ProjectLookup } from '../application/ports';

export const SEED_PROJECT_ID = 'proj_default';

export interface ProjectRecord {
  id: string;
  name: string;
  status: 'active' | 'archived';
}

export class InMemoryProjectStore implements ProjectLookup {
  private readonly projects = new Map<string, ProjectRecord>();

  constructor(seed: ProjectRecord[] = [{ id: SEED_PROJECT_ID, name: 'Default Project', status: 'active' }]) {
    for (const project of seed) {
      this.projects.set(project.id, project);
    }
  }

  async exists(projectId: string): Promise<boolean> {
    return this.projects.has(projectId);
  }
}
