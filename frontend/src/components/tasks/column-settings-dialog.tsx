import { Columns3 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_TASK_COLUMNS,
  type TaskColumnConfig,
} from '@/lib/table-columns';

type ColumnSettingsDialogProps = {
  columns: TaskColumnConfig[];
  onChange: (columns: TaskColumnConfig[]) => void;
};

export function ColumnSettingsDialog({ columns, onChange }: ColumnSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(columns);

  function openDialog() {
    setDraft(columns.map((c) => ({ ...c })));
    setOpen(true);
  }

  function updateRow(id: string, patch: Partial<TaskColumnConfig>) {
    setDraft((prev) => prev.map((col) => (col.id === id ? { ...col, ...patch } : col)));
  }

  function resetDefaults() {
    setDraft(DEFAULT_TASK_COLUMNS.map((c) => ({ ...c })));
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={openDialog}>
        <Columns3 />
        Columns
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customize columns</DialogTitle>
            <DialogDescription>
              Rename headers and choose which columns appear in the table view.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            {draft.map((col) => (
              <div
                key={col.id}
                className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-[#89d6fb] bg-[#d4f0fc]/40 p-3"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-[#01303f]">
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={(e) => updateRow(col.id, { visible: e.target.checked })}
                    className="size-4 accent-[#02a9f7]"
                  />
                  Show
                </label>
                <div className="space-y-1">
                  <Label htmlFor={`col-${col.id}`} className="text-xs text-[#02577a]">
                    Column name ({col.id})
                  </Label>
                  <Input
                    id={`col-${col.id}`}
                    value={col.label}
                    onChange={(e) => updateRow(col.id, { label: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button type="button" variant="ghost" onClick={resetDefaults}>
              Reset defaults
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  onChange(draft);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
