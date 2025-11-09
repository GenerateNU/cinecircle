// app/index.tsx
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import UserDashboard from '../components/UserDashboard';

export default function HomeRoute() {
  const { user, signOut } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <UserDashboard user={user} onSignOut={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});
