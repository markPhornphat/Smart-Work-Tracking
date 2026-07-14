import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteProject } from '@/hooks/use-projects';
import type { Project } from '@/lib/api';

type DeleteProjectDialogProps = {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: (projectId: string) => void;
};

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  async function onConfirm() {
    if (!project) return;
    await deleteProject.mutateAsync(project.id);
    onOpenChange(false);
    onDeleted?.(project.id);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            {project ? (
              <>
                <span className="font-medium text-foreground">
                  {project.key} · {project.name}
                </span>{' '}
                will be soft-deleted from this workspace. It will no longer appear in project lists.
              </>
            ) : (
              'This project will be soft-deleted from the workspace.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProject.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={deleteProject.isPending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
          >
            {deleteProject.isPending ? <Loader2 className="animate-spin" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
