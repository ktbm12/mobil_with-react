import apiClient from './client';

// ---- EXPLICATION SUR LES SERVICES API ----
// Toujours séparer les appels API des composants de l'interface graphique.
// Cela rend le code lisible, testable, et on peut réutiliser ces appels
// depuis n'importe quel écran de l'application.
// ------------------------------------------

// On définit un type TypeScript si l'extension le permet, 
// Ici on reste en JS "propre" mais TypeScript-friendly
export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export const TodoService = {
  // Liste toutes les tâches
  getAll: async (): Promise<Todo[]> => {
    // La méthode get() retourne les données sous l'objet `data` d'Axios
    const response = await apiClient.get<Todo[]>('/todos/');
    return response.data;
  },

  // Créer une nouvelle tâche
  create: async (title: string): Promise<Todo> => {
    const response = await apiClient.post<Todo>('/todos/', {
      title,
      done: false, // Par défaut, une tâche n'est pas terminée
    });
    return response.data;
  },

  // Mettre à jour une tâche (passer de terminé à pas terminé...)
  update: async (id: number, data: Partial<Todo>): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/todos/${id}/`, data);
    return response.data;
  },

  // Supprimer une tâche
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/todos/${id}/`);
  },
};
