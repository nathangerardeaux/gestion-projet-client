import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Participant, Project, Task, TaskStatus } from '../types';
import * as projectsApi from '../api/projects.api';
import * as tasksApi from '../api/tasks.api';
import { getApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { TaskForm } from '../components/TaskForm';
import { TaskRow } from '../components/TaskRow';
import { ParticipantsPanel } from '../components/ParticipantsPanel';
import { ALL_STATUSES, STATUS_LABELS } from '../labels';

export function ProjectDetailPage() {
  const { id } = useParams(); // le :id de l'URL /projects/:id
  const projectId = Number(id);
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filter, setFilter] = useState<TaskStatus | ''>(''); // '' = tous les statuts
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chargement du projet et des participants au montage (ou si l'id change).
  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([projectsApi.fetchProject(projectId), projectsApi.fetchParticipants(projectId)])
      .then(([p, parts]) => {
        setProject(p);
        setParticipants(parts);
      })
      .catch((err) => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Chargement des taches : refait a chaque changement de filtre (FT4).
  useEffect(() => {
    tasksApi
      .fetchTasks(projectId, filter === '' ? undefined : filter)
      .then(setTasks)
      .catch((err) => setError(getApiError(err)));
  }, [projectId, filter]);

  async function reloadTasks() {
    setTasks(await tasksApi.fetchTasks(projectId, filter === '' ? undefined : filter));
  }

  async function reloadParticipants() {
    setParticipants(await projectsApi.fetchParticipants(projectId));
  }

  async function handleTaskSubmit(title: string, description: string) {
    setError('');
    try {
      if (editingTask) {
        await tasksApi.updateTask(editingTask.id, title, description);
        setEditingTask(null);
      } else {
        await tasksApi.createTask(projectId, title, description);
      }
      await reloadTasks();
    } catch (err) {
      setError(getApiError(err));
      throw err; // le formulaire garde la saisie en cas d'echec
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setError('');
    try {
      await tasksApi.updateTaskStatus(task.id, status);
      await reloadTasks();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function handleAssign(task: Task, userId: number | null) {
    setError('');
    try {
      await tasksApi.updateTaskAssignee(task.id, userId);
      await reloadTasks();
    } catch (err) {
      setError(getApiError(err)); // notamment le 422 "pas participant"
    }
  }

  async function handleDeleteTask(task: Task) {
    if (!window.confirm(`Supprimer la tâche « ${task.title} » ?`)) return;
    setError('');
    try {
      await tasksApi.deleteTask(task.id);
      await reloadTasks();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function handleAddParticipant(email: string) {
    await projectsApi.addParticipant(projectId, email); // erreurs gerees par le panneau
    await reloadParticipants();
  }

  if (loading) return <p>Chargement...</p>;

  if (!project) {
    return (
      <main>
        <p className="error">{error || 'Projet introuvable'}</p>
        <Link to="/projects">Retour aux projets</Link>
      </main>
    );
  }

  return (
    <main className="detail">
      <Link to="/projects">← Mes projets</Link>
      <h2>{project.title}</h2>
      {project.description && <p>{project.description}</p>}
      {error && <p className="error">{error}</p>}

      <div className="columns">
        <section>
          <div className="toolbar">
            <h3>Tâches</h3>
            <label>
              Filtrer :
              <select value={filter} onChange={(e) => setFilter(e.target.value as TaskStatus | '')}>
                <option value="">Toutes</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <TaskForm
            key={editingTask?.id ?? 'new'}
            initial={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={editingTask ? () => setEditingTask(null) : undefined}
          />

          {tasks.length === 0 && <p>Aucune tâche{filter && ' avec ce statut'}.</p>}
          <ul className="task-list">
            {tasks.map((t) => (
              <TaskRow
                key={t.id}
                task={t}
                participants={participants}
                onStatusChange={handleStatusChange}
                onAssign={handleAssign}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        </section>

        <ParticipantsPanel
          participants={participants}
          canManage={project.owner_id === user?.id}
          onAdd={handleAddParticipant}
        />
      </div>
    </main>
  );
}
