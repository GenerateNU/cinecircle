import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AuthForm from '../../components/AuthForm';

export default function WelcomeScreen() {
  const handleAuthSuccess = () => {
    router.replace('/(tabs)/home');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to CineCircle</Text>
        <Text style={styles.subtitle}>
          Connect with friends and share your movie experiences
        </Text>
      </View>

      <AuthForm onAuthSuccess={handleAuthSuccess} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});