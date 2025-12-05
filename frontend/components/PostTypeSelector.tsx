import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export type PostTypeKey = 'short' | 'review';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  visible,
  onClose,
}: CreatePostModalProps) {
  const navigation = useNavigation<any>();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState<PostTypeKey | null>(null);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!visible) setSelected(null);
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [WINDOW_HEIGHT, WINDOW_HEIGHT * 0.18],
  });

  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const handleSelect = (type: PostTypeKey) => {
    setSelected(type);

    setTimeout(() => {
      navigation.navigate('CreatePost', {
        mode: type === 'short' ? 'SHORT' : 'LONG',
      });
      onClose();
    }, 220);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </Pressable>

      {/* PANEL */}
      <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        <Text style={styles.heading}>Create</Text>

        <View style={styles.row}>
          <Ticket
            label="Short Take"
            footer="Take"
            isSelected={selected === 'short'}
            onPress={() => handleSelect('short')}
          />

          <Ticket
            label="Review"
            footer="Review"
            isSelected={selected === 'review'}
            onPress={() => handleSelect('review')}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

/* Ticket component */
function Ticket({
  label,
  footer,
  isSelected,
  onPress,
}: {
  label: string;
  footer: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const ani = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(ani, {
      toValue: isSelected ? 1 : 0,
      friction: 7,
      tension: 120,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  const rotate = ani.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-8deg'],
  });

  const translateY = ani.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const scale = ani.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.ticketWrapper}
    >
      <Animated.View
        style={[
          styles.ticket,
          {
            transform: [{ translateY }, { rotate }, { scale }],
          },
        ]}
      >
        <Text style={styles.ticketText}>{label}</Text>
      </Animated.View>
      <Text style={styles.footer}>{footer}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#E6E6E6',
    alignSelf: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  ticketWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  ticket: {
    width: 150,
    height: 92,
    backgroundColor: '#FBEFEA',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F2B7AB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B44A38',
  },
  footer: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
});
