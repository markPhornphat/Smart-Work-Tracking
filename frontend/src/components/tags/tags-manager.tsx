import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { TagChip } from '@/components/tags/tag-chip';
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
  useCreateTag,
  useDeleteTag,
  useTags,
  useUpdateTag,
} from '@/hooks/use-tags';
import type { Tag } from '@/lib/api';

const PRESET_COLORS = ['#02a9f7', '#02577a', '#01303f', '#89d6fb', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

type TagsManagerProps = {
  projectId: string;
};

export function TagsManager({ projectId }: TagsManagerProps) {
  const tagsQuery = useTags(projectId);
  const createTag = useCreateTag(projectId);
  const updateTag = useUpdateTag(projectId);
  const deleteTag = useDeleteTag(projectId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);

  function openCreate() {
    setName('');
    setColor(PRESET_COLORS[0]);
    setCreateOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditTag(tag);
    setName(tag.name);
    setColor(tag.color);
  }

  async function onCreate() {
    if (!name.trim()) return;
    await createTag.mutateAsync({ name: name.trim(), color });
    setCreateOpen(false);
  }

  async function onUpdate() {
    if (!editTag || !name.trim()) return;
    await updateTag.mutateAsync({ id: editTag.id, name: name.trim(), color });
    setEditTag(null);
  }

  const tags = tagsQuery.data ?? [];

  return (
    <section className="rounded-xl border border-[#89d6fb] bg-card/90 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[#01303f]">Tags</h2>
          <p className="text-xs text-[#02577a]">Add, rename, recolor, or delete project tags</p>
        </div>
        <Button type="button" size="sm" onClick={openCreate}>
          <Plus />
          Add tag
        </Button>
      </div>

      {tagsQuery.isLoading ? (
        <div className="flex items-center gap-2 text-sm text-[#02577a]">
          <Loader2 className="size-4 animate-spin" />
          Loading tags…
        </div>
      ) : tags.length === 0 ? (
        <p className="text-sm text-[#02577a]">No tags yet. Create one to classify work.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.id} className="inline-flex items-center gap-1 rounded-lg border border-[#89d6fb] bg-[#d4f0fc]/60 p-1 pr-1.5">
              <TagChip name={tag.name} color={tag.color} />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-[#02577a] hover:bg-[#89d6fb]/50 hover:text-[#01303f]"
                onClick={() => openEdit(tag)}
                aria-label={`Edit ${tag.name}`}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-[#02577a] hover:bg-red-100 hover:text-red-700"
                onClick={() => {
                  if (confirm(`Delete tag “${tag.name}”?`)) {
                    void deleteTag.mutateAsync(tag.id);
                  }
                }}
                aria-label={`Delete ${tag.name}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create tag</DialogTitle>
            <DialogDescription>Tags belong to this project and can be attached to tasks.</DialogDescription>
          </DialogHeader>
          <TagFormFields name={name} color={color} onNameChange={setName} onColorChange={setColor} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" disabled={createTag.isPending || !name.trim()} onClick={() => void onCreate()}>
              {createTag.isPending ? <Loader2 className="animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editTag)} onOpenChange={(open) => !open && setEditTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit tag</DialogTitle>
            <DialogDescription>Update the label or color for this tag.</DialogDescription>
          </DialogHeader>
          <TagFormFields name={name} color={color} onNameChange={setName} onColorChange={setColor} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditTag(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={updateTag.isPending || !name.trim()} onClick={() => void onUpdate()}>
              {updateTag.isPending ? <Loader2 className="animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TagFormFields({
  name,
  color,
  onNameChange,
  onColorChange,
}: {
  name: string;
  color: string;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tag-name">Name</Label>
        <Input id="tag-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`h-8 w-8 rounded-full border-2 ${color === preset ? 'border-[#01303f]' : 'border-transparent'}`}
              style={{ backgroundColor: preset }}
              onClick={() => onColorChange(preset)}
              aria-label={`Color ${preset}`}
            />
          ))}
        </div>
        <Input type="color" value={color} onChange={(e) => onColorChange(e.target.value)} className="h-10 w-24 p-1" />
      </div>
    </div>
  );
}
