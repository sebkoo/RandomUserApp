import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { User } from '../types/User';
import { fetchUsers } from '../api/fetchUsers';

export const UserListScreen = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Image
              source={{ uri: item.picture.medium }}
              style={styles.avatar}
            />
            <Text>
              {item.name.first} {item.name.last}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
});
