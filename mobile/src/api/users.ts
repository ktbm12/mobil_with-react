import apiClient from './client';

export interface User {
  id: number;
  name: string;
  sub_name: string;
  done: boolean;
}

export const UserService = {
  // Liste tous les utilisateurs
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/apis/users/'); 
    return response.data;
  },

  create: async (name: string, sub_name: string): Promise<User> => {
    const response = await apiClient.post<User>('/apis/users/', {
      name,
      sub_name,
      done: false,
    });
    return response.data;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/apis/users/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/apis/users/${id}/`);
  },
};
