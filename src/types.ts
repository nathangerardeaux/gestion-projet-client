export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
  id: number;
  email: string;
  name: string;
}

// Ce que renvoie GET /projects/:id/participants (le proprietaire est inclus).
export interface Participant extends User {
  is_owner: 0 | 1;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  owner_id: number;
  created_at: string;
}

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignee_id: number | null;
  assignee_name: string | null;
}
