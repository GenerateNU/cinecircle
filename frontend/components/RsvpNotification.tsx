import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface RsvpNotificationProps {
  visible: boolean;
  response: 'yes' | 'maybe' | 'no' | null;
  onEdit?: () => void;
  onDismiss?: () => void;
}

export default function RsvpNotification({ 
  visible, 
  response, 
  onEdit,
  onDismiss 
}: RsvpNotificationProps) {
  const slideAnim = new Animated.Value(200);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // hide after 5 seconds?? or does it stay there idk
      const timeout = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timeout);
    } else {
      Animated.timing(slideAnim, {
        toValue: 200,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  const getResponseText = () => {
    if (response === 'yes') return 'Registered !!';
    if (response === 'maybe') return 'Maybe';
    if (response === 'no') return 'Not Attending';
    return 'Registered';
  };

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{getResponseText()}</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.subtitle}>Edit your RSVP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <MaterialIcons name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#A82411',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textDecorationLine: 'underline',
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});