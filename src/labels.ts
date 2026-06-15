import type { TaskStatus } from './types';

// LE seul endroit du projet qui connait les libelles francais des statuts
// (les valeurs techniques restent en anglais dans la base et l'API).
export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
};

export const ALL_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];
