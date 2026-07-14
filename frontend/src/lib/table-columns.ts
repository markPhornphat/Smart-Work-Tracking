export type TaskColumnId =
  | 'key'
  | 'title'
  | 'status'
  | 'priority'
  | 'tags'
  | 'section'
  | 'dueDate'
  | 'assignee';

export type TaskColumnConfig = {
  id: TaskColumnId;
  label: string;
  visible: boolean;
};

export const DEFAULT_TASK_COLUMNS: TaskColumnConfig[] = [
  { id: 'key', label: 'Key', visible: true },
  { id: 'title', label: 'Title', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'priority', label: 'Priority', visible: true },
  { id: 'tags', label: 'Tags', visible: true },
  { id: 'section', label: 'Section', visible: true },
  { id: 'dueDate', label: 'Due date', visible: false },
  { id: 'assignee', label: 'Assignee', visible: false },
];

function storageKey(projectId: string) {
  return `swt_task_columns_${projectId}`;
}

export function loadTaskColumns(projectId: string): TaskColumnConfig[] {
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    if (!raw) return DEFAULT_TASK_COLUMNS.map((c) => ({ ...c }));
    const parsed = JSON.parse(raw) as TaskColumnConfig[];
    const byId = new Map(parsed.map((c) => [c.id, c]));
    return DEFAULT_TASK_COLUMNS.map((def) => {
      const saved = byId.get(def.id);
      return saved
        ? { id: def.id, label: saved.label || def.label, visible: Boolean(saved.visible) }
        : { ...def };
    });
  } catch {
    return DEFAULT_TASK_COLUMNS.map((c) => ({ ...c }));
  }
}

export function saveTaskColumns(projectId: string, columns: TaskColumnConfig[]) {
  localStorage.setItem(storageKey(projectId), JSON.stringify(columns));
}
