import type { Participant, Task, TaskStatus } from '../types';
import { ALL_STATUSES, STATUS_LABELS } from '../labels';

interface Props {
  task: Task;
  participants: Participant[];
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onAssign: (task: Task, userId: number | null) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskRow({ task, participants, onStatusChange, onAssign, onEdit, onDelete }: Props) {
  return (
    <li className={`card task status-${task.status}`}>
      <div className="task-main">
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
      </div>

      <label>
        Statut
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <label>
        Assigné
        <select
          value={task.assignee_id ?? ''}
          onChange={(e) => onAssign(task, e.target.value === '' ? null : Number(e.target.value))}
        >
          <option value="">Personne</option>
          {participants.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <div className="actions">
        <button onClick={() => onEdit(task)}>Modifier</button>
        <button onClick={() => onDelete(task)}>Supprimer</button>
      </div>
    </li>
  );
}
