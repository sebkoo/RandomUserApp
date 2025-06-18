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
