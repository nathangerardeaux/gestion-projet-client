import { api } from './client';
import type { Participant, Project } from '../types';

export const fetchProjects = async () => (await api.get<Project[]>('/projects')).data;

export const fetchProject = async (id: number) => (await api.get<Project>(`/projects/${id}`)).data;

export const createProject = async (title: string, description: string) =>
  (await api.post<Project>('/projects', { title, description })).data;

export const updateProject = async (id: number, title: string, description: string) =>
  (await api.put<Project>(`/projects/${id}`, { title, description })).data;

export const deleteProject = async (id: number) => {
  await api.delete(`/projects/${id}`);
};

export const fetchParticipants = async (id: number) =>
  (await api.get<Participant[]>(`/projects/${id}/participants`)).data;

export const addParticipant = async (id: number, email: string) => {
  await api.post(`/projects/${id}/participants`, { email });
};
