import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { User } from '../types/User';
import { fetchUsers } from '../api/fetchUsers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loadUsers, saveUsers } from '../utilities/storage';
import { AntDesign } from '@expo/vector-icons';
import { saveFavorites, loadFavorites } from '../utilities/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

export const UserListScreen = ({ navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [favoriteEmails, setFavoriteEmails] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const favorites = await loadFavorites();
      setFavoriteEmails(favorites);

      const cached = await loadUsers();
      if (cached && cached.length > 0) {
        setUsers(cached);
        setFiltered(cached);
        setLoading(false);
      }

      try {
        const fresh = await fetchUsers();
        setUsers(fresh);
        setFiltered(fresh);
        saveUsers(fresh); // Update cache
      } catch (e) {
        console.warn('Use cached data due to fetch error.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filteredData = users.filter((user) =>
      `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
    );
    setFiltered(filteredData);
  }, [search, users]);

  const toggleFavorite = async (email: string) => {
    const updated = favoriteEmails.includes(email)
      ? favoriteEmails.filter((e) => e !== email)
      : [...favoriteEmails, email];

    setFavoriteEmails(updated);
    await saveFavorites(updated);
  };

  const isFavorite = (email: string) => favoriteEmails.includes(email);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Users</Text>

      <TextInput
        style={styles.input}
        placeholder="Search by name..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserDetail', { user: item })}
          >
            <View style={styles.userCard}>
              <Image
                source={{ uri: item.picture.medium }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text>
                  {item.name.first} {item.name.last}
                </Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(item.email)}>
                <AntDesign
                  name={isFavorite(item.email) ? 'heart' : 'hearto'}
                  size={24}
                  color={isFavorite(item.email) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userInfo: { flex: 1 },
  email: { fontSize: 12, color: `#555` },
});
