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
  Button,
} from 'react-native';
import { User } from '../types/User';
import { fetchUsers } from '../api/fetchUsers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  loadUsers,
  saveUsers,
  loadFavorites,
  saveFavorites,
} from '../utilities/storage';
import { AntDesign } from '@expo/vector-icons';
import { AnimatedHeart } from '../components/AnimatedHeart';
import {
  scheduleLocalNotificaiton,
  registerForPushNotificaitons,
} from '../utilities/notifications';
import * as Notifications from 'expo-notifications';
import { UserCard } from '../components/UserCard';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type Props = NativeStackScreenProps<RootStackParamList, 'UserList'>;

export const UserListScreen = ({ navigation }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [favoriteEmails, setFavoriteEmails] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'name' | 'country'>('name');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(99);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [nationality, setNationality] = useState('');
  const [registeredYear, setRegisteredYear] = useState('');

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
    registerForPushNotificaitons();
  }, []);

  const onReresh = async () => {
    try {
      setRefreshing(true);
      const fresh = await fetchUsers();
      setUsers(fresh);
      setFiltered(fresh);
      await saveUsers(fresh);
    } catch (e) {
      console.warn('Refresh failed');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let filteredData = [...users];

    // Filter by gender
    if (genderFilter !== 'all') {
      filteredData = filteredData.filter(
        (user) => user.gender === genderFilter
      );
    }

    // Filter by age
    filteredData = filteredData.filter(
      (user) => user.dob.age >= minAge && user.dob.age <= maxAge
    );

    // Filter by country
    if (country.trim()) {
      const countryLower = country.toLowerCase();
      filteredData = filteredData.filter((user) =>
        user.location.country.toLowerCase().includes(countryLower)
      );
    }

    // Filter by name search
    const query = search.toLowerCase();
    filteredData = filteredData.filter((user) =>
      `${user.name.first} ${user.name.last}`.toLowerCase().includes(query)
    );

    // Filter by city
    if (city.trim()) {
      const cityLower = city.toLowerCase();
      filteredData = filteredData.filter((user) =>
        user.location.city.toLowerCase().includes(cityLower)
      );
    }

    // Filter by registration year
    if (registeredYear.trim()) {
      filteredData = filteredData.filter((user) => {
        const year = new Date(user.registered.date).getFullYear().toString();
        return year === registeredYear.trim();
      });
    }

    // Sort
    if (sortBy === 'name') {
      filteredData.sort((a, b) =>
        `${a.name.first} ${a.name.last}`.localeCompare(
          `${b.name.first} ${b.name.last}`
        )
      );
    } else if (sortBy === 'country') {
      filteredData.sort((a, b) =>
        a.location.country.localeCompare(b.location.country)
      );
    }

    setFiltered(filteredData);
  }, [search, users, genderFilter, sortBy, minAge, maxAge, country]);

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

      <View style={styles.controls}>
        <View style={styles.filterGroup}>
          <Text style={styles.label}>Gender:</Text>
          <Button title="All" onPress={() => setGenderFilter('all')} />
          <Button title="Male" onPress={() => setGenderFilter('male')} />
          <Button title="Female" onPress={() => setGenderFilter('female')} />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>Sort by:</Text>
          <Button title="Name" onPress={() => setSortBy('name')} />
          <Button title="Country" onPress={() => setSortBy('country')} />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>Age Range:</Text>
          <TextInput
            style={styles.inputSmall}
            keyboardType="numeric"
            value={String(minAge)}
            onChangeText={(val) => setMinAge(Number(val))}
            placeholder="Min"
          />
          <TextInput
            style={styles.inputSmall}
            keyboardType="numeric"
            value={String(maxAge)}
            onChangeText={(val) => setMaxAge(Number(val))}
            placeholder="Max"
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>Country:</Text>
          <TextInput
            style={styles.input}
            value={country}
            onChangeText={setCountry}
            placeholder="e.g. United States"
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>City:</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. London"
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>Registered Year:</Text>
          <TextInput
            style={styles.inputSmall}
            keyboardType="numeric"
            value={registeredYear}
            onChangeText={setRegisteredYear}
            placeholder="e.g. 2018"
          />
        </View>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title="🔔 Remind Me in 10s"
          onPress={scheduleLocalNotificaiton}
        />
      </View>

      <Button
        title={`Switch to ${viewMode === 'grid' ? 'List' : 'Grid'} View`}
        onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
      />

      <FlatList
        key={viewMode} // Forces re-render when numColumns changes
        data={filtered}
        keyExtractor={(item) => item.email}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={{ paddingBottom: 100 }}
        columnWrapperStyle={
          viewMode === 'grid' ? { justifyContent: 'space-between' } : undefined
        }
        renderItem={({ item }) =>
          viewMode === 'grid' ? (
            <UserCard
              user={item}
              onPress={() => navigation.navigate('UserDetail', { user: item })}
            />
          ) : (
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
                <AnimatedHeart
                  isFavorite={isFavorite(item.email)}
                  onToggle={() => toggleFavorite(item.email)}
                />
              </View>
            </TouchableOpacity>
          )
        }
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
  controls: { marginBottom: 12 },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: { fontWeight: 'bold', marginRight: 6 },
  inputSmall: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
  },
});
