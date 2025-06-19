import React, { useRef } from 'react';
import { TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
};

export const AnimatedHeart = ({ isFavorite, onToggle }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onToggle());
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <AntDesign
          name={isFavorite ? 'heart' : 'hearto'}
          size={24}
          color={isFavorite ? 'red' : 'gray'}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
