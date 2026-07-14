import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type WorkItemStatus = 'todo' | 'in_progress' | 'done';

interface WorkItem {
  id: string;
  projectId: string;
  title: string;
  status: WorkItemStatus;
  createdAt: string;
  updatedAt: string;
}

const SEED_PROJECT_ID = 'proj_default';

const STATUS_ACTIONS: Record<WorkItemStatus, WorkItemStatus[]> = {
  todo: ['in_progress', 'done'],
  in_progress: ['todo', 'done'],
  done: ['in_progress'],
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

function App() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<{ items: WorkItem[] }>(
        `/api/v1/work-items?projectId=${encodeURIComponent(SEED_PROJECT_ID)}`,
      );
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await fetchJson<WorkItem>('/api/v1/work-items', {
        method: 'POST',
        body: JSON.stringify({ projectId: SEED_PROJECT_ID, title }),
      });
      setTitle('');
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create work item');
    }
  }

  async function onStatusChange(id: string, status: WorkItemStatus) {
    setError(null);
    try {
      await fetchJson<WorkItem>(`/api/v1/work-items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  return (
    <div className="app">
      <header className="header">
        <p className="brand">Smart-Work-Tracking</p>
        <h1>Work items</h1>
        <p className="lede">Track delivery for project <code>{SEED_PROJECT_ID}</code>.</p>
      </header>

      <form className="create" onSubmit={onCreate}>
        <label htmlFor="title">New work item</label>
        <div className="row">
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            required
          />
          <button type="submit">Add</button>
        </div>
      </form>

      {error ? <p className="error" role="alert">{error}</p> : null}

      <section className="list" aria-live="polite">
        <h2>Current board</h2>
        {loading ? <p className="muted">Loading…</p> : null}
        {!loading && items.length === 0 ? <p className="muted">No work items yet.</p> : null}
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span className={`status status-${item.status}`}>{item.status}</span>
              </div>
              <div className="actions">
                {STATUS_ACTIONS[item.status].map((next) => (
                  <button key={next} type="button" onClick={() => void onStatusChange(item.id, next)}>
                    → {next}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
