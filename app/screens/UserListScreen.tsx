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

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

export const UserListScreen = ({ navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    const filteredData = users.filter((user) =>
      `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
    );
    setFiltered(filteredData);
  }, [search, users]);

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
              <Text>
                {item.name.first} {item.name.last}
              </Text>
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
});
