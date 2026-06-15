import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import * as projectsApi from '../api/projects.api';
import { getApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); // null = mode creation
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void reload();
  }, []);

  async function reload() {
    setLoading(true);
    setError('');
    try {
      setProjects(await projectsApi.fetchProjects());
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setDescription('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId === null) {
        await projectsApi.createProject(title, description);
      } else {
        await projectsApi.updateProject(editingId, title, description);
      }
      resetForm();
      await reload();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Project) {
    if (!window.confirm(`Supprimer le projet « ${p.title} » et toutes ses tâches ?`)) return;
    setError('');
    try {
      await projectsApi.deleteProject(p.id);
      await reload();
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return (
    <main>
      <h2>Mes projets</h2>

      <form onSubmit={handleSubmit} className="card">
        <h3>{editingId === null ? 'Nouveau projet' : 'Modifier le projet'}</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          required
          maxLength={200}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="actions">
          <button type="submit" disabled={saving}>
            {editingId === null ? 'Créer' : 'Enregistrer'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Chargement...</p>}
      {!loading && projects.length === 0 && <p>Aucun projet pour le moment : crée le premier !</p>}

      <ul className="cards">
        {projects.map((p) => (
          <li key={p.id} className="card">
            <Link to={`/projects/${p.id}`}>
              <strong>{p.title}</strong>
            </Link>
            {p.description && <p>{p.description}</p>}
            {p.owner_id === user?.id && (
              <div className="actions">
                <button onClick={() => startEdit(p)}>Modifier</button>
                <button onClick={() => handleDelete(p)}>Supprimer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
