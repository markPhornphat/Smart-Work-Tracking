import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject, useTemplates, useUpdateProject } from '@/hooks/use-projects';
import type { Project } from '@/lib/api';

const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  key: z
    .string()
    .min(1, 'Key is required')
    .max(16, 'Max 16 characters')
    .regex(/^[A-Za-z][A-Za-z0-9]*$/, 'Letters and numbers; start with a letter'),
  description: z.string().optional(),
  templateKey: z.string().optional(),
});

const editSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string | null;
  mode: 'create' | 'edit';
  project?: Project | null;
  onCreated?: (project: Project) => void;
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  workspaceId,
  mode,
  project,
  onCreated,
}: ProjectFormDialogProps) {
  const templates = useTemplates();
  const createProject = useCreateProject(workspaceId);
  const updateProject = useUpdateProject();

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: '', key: '', description: '', templateKey: 'blank' },
  });

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === 'create') {
      createForm.reset({ name: '', key: '', description: '', templateKey: 'blank' });
    } else if (project) {
      editForm.reset({
        name: project.name,
        description: project.description ?? '',
      });
    }
  }, [open, mode, project, createForm, editForm]);

  async function onCreate(values: CreateValues) {
    const created = await createProject.mutateAsync({
      name: values.name,
      key: values.key.toUpperCase(),
      description: values.description || undefined,
      templateKey: values.templateKey || 'blank',
    });
    onOpenChange(false);
    onCreated?.(created);
  }

  async function onEdit(values: EditValues) {
    if (!project) return;
    await updateProject.mutateAsync({
      id: project.id,
      name: values.name,
      description: values.description || null,
    });
    onOpenChange(false);
  }

  const busy = createProject.isPending || updateProject.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create project' : 'Edit project'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Projects belong to the current workspace and can use a workflow template.'
              : 'Update the project name and description. The key cannot be changed.'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'create' ? (
          <form className="space-y-4" onSubmit={createForm.handleSubmit(onCreate)}>
            <div className="space-y-2">
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" {...createForm.register('name')} />
              {createForm.formState.errors.name ? (
                <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-key">Key</Label>
              <Input
                id="project-key"
                className="font-mono uppercase"
                placeholder="e.g. MKTG"
                {...createForm.register('key')}
              />
              {createForm.formState.errors.key ? (
                <p className="text-xs text-destructive">{createForm.formState.errors.key.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea id="project-description" rows={3} {...createForm.register('description')} />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select
                value={createForm.watch('templateKey') ?? 'blank'}
                onValueChange={(value) => createForm.setValue('templateKey', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {(templates.data ?? []).map((tpl) => (
                    <SelectItem key={tpl.id} value={tpl.key}>
                      {tpl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy || !workspaceId}>
                {busy ? <Loader2 className="animate-spin" /> : null}
                Create
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={editForm.handleSubmit(onEdit)}>
            <div className="space-y-2">
              <Label>Key</Label>
              <Input value={project?.key ?? ''} disabled className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-name">Name</Label>
              <Input id="edit-project-name" {...editForm.register('name')} />
              {editForm.formState.errors.name ? (
                <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-project-description">Description</Label>
              <Textarea
                id="edit-project-description"
                rows={3}
                {...editForm.register('description')}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
