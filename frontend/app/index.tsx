import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../components/UserDashboard';

export default function HomeRoute() {
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace('/welcome');
    }
  }, [user, loading]);

  // Don't render home content until we know user is authenticated
  if (loading || !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <UserDashboard user={user} onSignOut={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});