import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { User } from '../types/User';
import { loadUsers, loadFavorites } from '../utilities/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<User[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const exportFavorites = async () => {
    try {
      const json = JSON.stringify(favorites, null, 2);
      const fileUri = FileSystem.documentDirectory + 'favorite_users.json';
      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const allUsers = await loadUsers();
      const favoriteEmails = await loadFavorites();

      if (allUsers) {
        const onlyFavorites = allUsers.filter((user) =>
          favoriteEmails.includes(user.email)
        );
        setFavorites(onlyFavorites);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styels.container}>
      <View style={styels.header}>
        <Text style={styels.title}>❤️ Favorites</Text>
        <TouchableOpacity onPress={exportFavorites} style={styels.exportButton}>
          <Text style={styels.exportText}>Export</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('UserDetail', { user: item })}
          >
            <View style={styels.userCard}>
              <Image
                source={{ uri: item.picture.medium }}
                style={styels.avatar}
              />
              <View style={styels.info}>
                <Text>
                  {item.name.first} {item.name.last}
                </Text>
                <Text style={styels.email}>{item.email}</Text>
              </View>
              <AntDesign name="heart" size={24} color="red" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styels = StyleSheet.create({
  container: { flex: 1, marginTop: 50, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info: { flex: 1 },
  email: { fontSize: 12, color: '#555' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  exportText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
