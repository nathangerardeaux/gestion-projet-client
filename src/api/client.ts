import axios from 'axios';

// Instance axios partagee par toute l'application.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
});

// Avant CHAQUE requete : on attache le jeton JWT s'il existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Apres CHAQUE reponse : un 401 signifie jeton invalide/expire -> purge et retour au login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Extrait un message lisible de n'importe quelle erreur axios.
export function getApiError(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.error) {
    return err.response.data.error as string;
  }
  return 'Une erreur est survenue. Verifie que le serveur est demarre et reessaie.';
}
