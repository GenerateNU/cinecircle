import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import UserDashboard from '../../../components/UserDashboard';

export default function HomeRoute() {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <UserDashboard user={user} onSignOut={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});