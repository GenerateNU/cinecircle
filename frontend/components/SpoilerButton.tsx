import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface SpoilerButtonProps {
  isSpoiler: boolean;
  onToggle: (value: boolean) => void;
}

export default function SpoilerButton({ isSpoiler, onToggle }: SpoilerButtonProps) {
  const toggleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: isSpoiler ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isSpoiler]);

  return (
    <View style={styles.spoilerContainer}>
      <Text style={styles.spoilerLabel}>Spoiler</Text>
      <TouchableOpacity
        onPress={() => onToggle(!isSpoiler)}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.toggleButton,
            {
              backgroundColor: toggleAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['#F7D5CD', '#F7D5CD', '#D62E05'],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.toggleKnob,
              isSpoiler
                ? styles.toggleKnobActive
                : styles.toggleKnobInactive,
              {
                transform: [
                  {
                    translateX: toggleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 22], // 46 (toggle width) - 18 (knob width) - 6 (padding * 2) = 22
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  spoilerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spoilerLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
  },
  toggleButton: {
    width: 46,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 3,
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobInactive: {
    shadowColor: 'rgba(171, 37, 4, 0.15)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    shadowColor: '#AB2504',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
});
