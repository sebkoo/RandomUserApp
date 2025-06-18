import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const STORAGE_KEY = 'cached_users';

export const saveUsers = async (users: User[]): Promise<void> => {
  try {
    const json = JSON.stringify(users);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error('Failed to save users:', e);
  }
};

export const loadUsers = async (): Promise<User[] | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to load users:', e);
    return null;
  }
};

const FAVORITES_KEY = 'favorite_emails';

export const saveFavorites = async (emails: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(emails));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
};

export const loadFavorites = async (): Promise<string[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Failed to load favorites:', e);
    return [];
  }
};
