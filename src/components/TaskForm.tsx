import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Task } from '../types';

interface Props {
  initial?: Task | null; // tache a editer, ou null/undefined = creation
  onSubmit: (title: string, description: string) => Promise<void>;
  onCancel?: () => void;
}

export function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(title, description);
      if (!initial) {
        setTitle(''); // en creation : on vide pour enchainer
        setDescription('');
      }
    } catch {
      // l'erreur est deja affichee par la page parente : on garde la saisie
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de la tâche"
        required
        maxLength={200}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optionnelle)"
      />
      <div className="actions">
        <button type="submit" disabled={saving}>
          {initial ? 'Enregistrer' : 'Ajouter la tâche'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
