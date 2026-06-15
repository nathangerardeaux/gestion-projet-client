import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Participant } from '../types';
import { getApiError } from '../api/client';

interface Props {
  participants: Participant[];
  canManage: boolean; // seul le proprietaire peut inviter
  onAdd: (email: string) => Promise<void>;
}

export function ParticipantsPanel({ participants, canManage, onAdd }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onAdd(email);
      setEmail('');
    } catch (err) {
      setError(getApiError(err)); // 404 email inconnu / 409 deja participant
    } finally {
      setSaving(false);
    }
  }

  return (
    <aside className="card participants">
      <h3>Participants</h3>
      <ul>
        {participants.map((p) => (
          <li key={p.id}>
            {p.name} <small>{p.email}</small>
            {p.is_owner === 1 && <em> (propriétaire)</em>}
          </li>
        ))}
      </ul>

      {canManage && (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email du participant"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button disabled={saving}>Ajouter</button>
        </form>
      )}
    </aside>
  );
}
