import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { User } from '../types/User';

const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 48) / 2; // padding + margin

type Props = {
  user: User;
  onPress: () => void;
};

export const UserCard = ({ user, onPress }: Props) => (
  <TouchableOpacity onPress={onPress} style={styels.card}>
    <Image source={{ uri: user.picture.large }} style={styels.image} />
    <Text style={styels.name}>
      {user.name.first} {user.name.last}
    </Text>
    <Text style={styels.location}>{user.location.country}</Text>
  </TouchableOpacity>
);

const styels = StyleSheet.create({
  card: {
    width: cardSize,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: cardSize,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  location: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
});
