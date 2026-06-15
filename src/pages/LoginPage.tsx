import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getApiError } from '../api/client';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // empeche le rechargement de page du formulaire HTML
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/projects'); // succes -> direction mes projets
    } catch (err) {
      setError(getApiError(err)); // 401 -> "Identifiants invalides"
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p className="hint">
        Comptes de démo : demo@exemple.fr, alice@exemple.fr ou bob@exemple.fr / Demo1234!
      </p>
    </main>
  );
}
