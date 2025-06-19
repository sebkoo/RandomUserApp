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
import { RootStackParamList } from '../navigation/AppNavigator';
import { AntDesign } from '@expo/vector-icons';

export const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState<User[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
      <Text style={styels.title}>❤️ Favorites</Text>
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
});
