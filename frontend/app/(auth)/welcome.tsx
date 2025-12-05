import React from 'react';
import {
  Text,
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import logo from '../../assets/Logo2x.png';

export default function Welcome() {
  const { width, height } = useWindowDimensions();
  const go = (to: string) => router.push(to);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo + title */}
      <View style={styles.content}>
        <Image
          source={logo}
          style={{
            width: width * 0.55,
            height: width * 0.55,
            marginBottom: height * 0.03,
          }}
          resizeMode="contain"
        />
        <Text style={[styles.title, { fontSize: width * 0.085 }]}>
          CineCircle
        </Text>
      </View>

      {/* Smaller buttons, higher up */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => go('/(auth)/login')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Log-In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => go('/(auth)/signup')}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#A53A1A';
const PRIMARY_LIGHT = '#F7D5CD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontWeight: '700',
    color: PRIMARY,
    textAlign: 'center',
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 80, // ← raises buttons higher
    gap: 14,
  },

  primaryButton: {
    width: '75%', // ← smaller width
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  secondaryButton: {
    width: '75%', // ← smaller width matches log-in
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY_LIGHT,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: '600',
  },
});
