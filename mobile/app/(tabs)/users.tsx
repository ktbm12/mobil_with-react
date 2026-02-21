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
import { useRouter } from 'expo-router';
// On importe le service des utilisateurs
import { User, UserService } from '../../src/api/users';

export default function UsersScreen() {
  const router = useRouter();
  
  // --------- ÉTATS (STATE) ---------
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState('');
  const [newSubName, setNewSubName] = useState('');

  // --------- FONCTIONS ---------

  // 1. Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des Users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Ajouter un utilisateur
  const handleAddUser = async () => {
    if (!newName.trim()) return;

    try {
      const nouveauUser = await UserService.create(newName.trim(), newSubName.trim());
      setUsers((prev) => [...prev, nouveauUser]);
      setNewName('');
      setNewSubName('');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  // 3. Basculer l'état (done)
  const handleToggleUser = async (user: User) => {
    try {
      const updatedUser = await UserService.update(user.id, { done: !user.done });
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // 4. Supprimer un utilisateur
  const handleDeleteUser = async (id: number) => {
    try {
      await UserService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // --------- RENDU (UI) ---------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header avec bouton Retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des Utilisateurs</Text>
        <Text style={styles.headerSubtitle}>Interface CRUD Professionnelle 👥</Text>
      </View>

      {/* Zone de Liste */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#673AB7" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Aucun utilisateur configuré.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.userCard, item.done && styles.userCardDone]}
                onPress={() => handleToggleUser(item)}
              >
                <View style={styles.userContent}>
                  <Text style={[styles.userName, item.done && styles.textDone]}>
                    {item.name}
                  </Text>
                  {item.sub_name ? (
                    <Text style={styles.userSubName}>{item.sub_name}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(item.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Zone de Saisie (Formulaire) */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Nom de l'utilisateur..."
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="Profession / Bio..."
          value={newSubName}
          onChangeText={setNewSubName}
        />
        <TouchableOpacity
          style={[styles.addButton, !newName.trim() && styles.disabledButton]}
          onPress={handleAddUser}
          disabled={!newName.trim()}
        >
          <Text style={styles.addButtonText}>Ajouter l'utilisateur</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Teinte violette légère
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#673AB7', // Violet profond
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#D1C4E9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1C4E9',
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9575CD',
    marginTop: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userCardDone: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  userContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userSubName: {
    fontSize: 14,
    color: '#7E57C2',
    marginTop: 2,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#AAA',
  },
  deleteButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  inputArea: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#D1C4E9',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#673AB7',
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B19CD9',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
