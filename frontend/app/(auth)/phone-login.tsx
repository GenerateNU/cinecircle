import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import PhoneAuthForm from '../../components/PhoneAuthForm';
import { useAuth } from '../../context/AuthContext';

export default function PhoneLoginScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleAuthSuccess = (user: any) => {
    console.log('Phone auth successful:', user);
    // Navigate to home
    router.replace('/(tabs)/home');
  };

  // If already authenticated, show status
  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.successText}>✓ Already authenticated</Text>
          <Text style={styles.infoText}>User ID: {user.id}</Text>
          <Text style={styles.infoText}>Phone: {user.phone || 'N/A'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.header}>WhatsApp Phone Login</Text>
          <Text style={styles.description}>
            Enter your phone number to receive a verification code via WhatsApp
          </Text>
          <PhoneAuthForm onAuthSuccess={handleAuthSuccess} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  successText: {
    fontSize: 20,
    color: '#0f5132',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});
