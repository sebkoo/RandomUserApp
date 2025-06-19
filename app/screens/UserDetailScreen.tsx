import React from 'react';
import { View, Text, Image, StyleSheet, Button, Share } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

export const UserDetailScreen = ({ route }: Props) => {
  const { user } = route.params;

  const dobFormatted = new Date(user.dob.date).toLocaleDateString();

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out ${user.name.first} ${user.name.last} from ${user.location.city}, ${user.location.country}.  You can reach them at ${user.email}.`,
      });
    } catch (error) {
      console.error(`Error sharing user:`, error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.picture.large }} style={styles.avatar} />
      <Text style={styles.name}>
        {user.name.title} {user.name.first} {user.name.last}
      </Text>
      <Text style={styles.detail}>
        📍 {user.location.city}, {user.location.country}
      </Text>
      <Text style={styles.detail}>📞 {user.phone}</Text>
      <Text style={styles.detail}>
        🎂 {dobFormatted} (Age: {user.dob.age})
      </Text>
      <Text style={styles.detail}>✉️ {user.email}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Share User Info" onPress={onShare} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: { fontSize: 18, marginVertical: 4, textAlign: 'center' },
});
