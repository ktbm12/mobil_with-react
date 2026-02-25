import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// On importe le service qui fait le lien avec Django
import { Todo, TodoService } from '../src/api/todos';

export default function App() {
  // --------- ÉTATS (STATE) ---------
  // En React, l'état (state) permet de re-rendre l'interface quand une donnée change
  const [isLoading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  // --------- FONCTIONS ---------

  // 1. Récupérer toutes les tâches depuis Django (GET)
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await TodoService.getAll();
      setTodos(data); // On met à jour l'état avec la donnée reçue
    } catch (error) {
      console.error('Erreur lors de la récupération des Todos:', error);
      // En production, on afficherait un message d'erreur à l'utilisateur ici
    } finally {
      setLoading(false);
    }
  };

  // On appelle fetchTodos une seule fois au montage du composant
  // grâce au tableau de dépendances vide [] du useEffect
  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. Ajouter une nouvelle tâche (POST)
  const handleAddTodo = async () => {
    // On ne fait rien si le texte est vide (après avoir enlevé les espaces)
    if (!newTitle.trim()) return;

    try {
      // On envoie la requête à l'API Django
      const nouvelleTache = await TodoService.create(newTitle.trim());
      // On ajoute dynamiquement la tâche renvoyée par le serveur à notre liste locale
      // (Cela évite de devoir recharger toute la liste via fetchTodos)
      setTodos((prevTodos) => [...prevTodos, nouvelleTache]);
      // On vide le champ texte
      setNewTitle('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du Todo:", error);
    }
  };

  // 3. Basculer l'état terminé/non-terminé d'une tâche (PATCH)
  const handleToggleTodo = async (todo: Todo) => {
    try {
      // On demande au backend de mettre à jour
      const updatedTodo = await TodoService.update(todo.id, { done: !todo.done });
      // On met à jour visuellement notre liste
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // 4. Supprimer une tâche (DELETE)
  const handleDeleteTodo = async (id: number) => {
    try {
      await TodoService.delete(id);
      // On retire directement la tâche du State React pour une interface rapide
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // --------- RENDU (UI) ---------
  return (
    // KeyboardAvoidingView est essentiel sur mobile pour éviter que 
    // le clavier virtuel ne cache le champ de saisie
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Objectifs Django</Text>
        <Text style={styles.headerSubtitle}>Ultra-Professionnel 🔥</Text>
      </View>

      {/* Zone principale : Liste ou Chargement */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            // Que se passe-t-il si la liste est vide ?
            ListEmptyComponent={
              <Text style={styles.emptyText}>Aucune tâche pour le moment. À vous de jouer !</Text>
            }
            renderItem={({ item }) => (
              // On enveloppe chaque tâche dans un TouchableOpacity pour détecter le clic
              <TouchableOpacity
                style={[
                  styles.todoCard,
                  item.done && styles.todoCardDone // on applique ce style si 'done' est vrai
                ]}
                onPress={() => handleToggleTodo(item)}
                activeOpacity={0.7}
              >
                <View style={styles.todoContent}>
                  {/* Une petite pastille pour montrer l'état */}
                  <View style={[styles.statusDot, item.done && styles.statusDotDone]} />
                  <Text
                    style={[
                      styles.todoTitle,
                      item.done && styles.todoTitleDone
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>

                {/* Bouton de suppression */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTodo(item.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Zone basse : Saisie d'une nouvelle tâche */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nouvel objectif..."
          placeholderTextColor="#999"
          value={newTitle}
          onChangeText={setNewTitle}
          // On valide aussi la tâche quand l'utilisateur appuie sur "Entrée" du clavier
          onSubmitEditing={handleAddTodo}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            // On grise le bouton si le champ est vide
            !newTitle.trim() && styles.addButtonDisabled
          ]}
          onPress={handleAddTodo}
          disabled={!newTitle.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// --------- STYLES (StyleSheet) ---------
// En React Native, on utilise un objet StyleSheet similaire au CSS.
// Le moteur de rendu utilise Flexbox de manière native.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Un gris très clair pour un effet App Moderne
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4A90E2', // Bleu professionnel rassurant
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Pour l'ombre sur Android
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0EEFC',
    marginTop: 4,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1, // Prend tout l'espace disponible
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    gap: 12, // Espace constant entre les éléments (gap est très moderne)
  },
  emptyText: {
    textAlign: 'center',
    color: '#A0AAB5',
    fontSize: 16,
    marginTop: 40,
  },
  todoCard: {
    flexDirection: 'row', // Aligne les enfants horizontalement (gauche - droite)
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2', // Liseré bleu sur le côté gauche
  },
  todoCardDone: {
    opacity: 0.6, // On rend la carte légèrement transparente si finie
    borderLeftColor: '#4CAF50', // Liseré devient vert
    backgroundColor: '#F3FBF4',
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    marginRight: 12,
  },
  statusDotDone: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  todoTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    flexShrink: 1, // Permet au texte de passer à la ligne s'il est trop long
  },
  todoTitleDone: {
    textDecorationLine: 'line-through', // Barre le texte
    color: '#888',
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 18,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#FF5252', // Rouge erreur standard
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20, // Plus de marge basse sur iOS (barre de navigation)
  },
  input: {
    flex: 1, // Prend tout l'espace disponible sauf celui pris par le bouton
    height: 50,
    backgroundColor: '#F4F6F8',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#B0C4DE', // Gris-bleu terne
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2, // Ajuste légèrement le + pour le centrer optiquement
  },
});