import type { TaskStatus } from './types';

// libelles francais des statuts (le reste du code reste en anglais)
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
};

export const ALL_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
