import { api } from './client';
import type { Task, TaskStatus } from '../types';

export const fetchTasks = async (projectId: number, status?: TaskStatus) =>
  (await api.get<Task[]>(`/projects/${projectId}/tasks`, { params: status ? { status } : {} })).data;

export const createTask = async (projectId: number, title: string, description: string) =>
  (await api.post<Task>(`/projects/${projectId}/tasks`, { title, description })).data;

export const updateTask = async (taskId: number, title: string, description: string) =>
  (await api.put<Task>(`/tasks/${taskId}`, { title, description })).data;

export const updateTaskStatus = async (taskId: number, status: TaskStatus) =>
  (await api.patch<Task>(`/tasks/${taskId}/status`, { status })).data;

export const updateTaskAssignee = async (taskId: number, userId: number | null) =>
  (await api.patch<Task>(`/tasks/${taskId}/assignee`, { userId })).data;

export const deleteTask = async (taskId: number) => {
  await api.delete(`/tasks/${taskId}`);
};
