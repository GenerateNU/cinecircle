import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { getProtected, getUserProfile } from '../services/userService';
import { api } from '../services/apiClient';
import type { components } from '../types/api-generated';

type DbTestResponse = components['schemas']['DbTestResponse'];

type Props = {
  user: any;
  onSignOut: () => void;
};

const UserDashboard = ({ user, onSignOut }: Props) => {
  const navigation = useNavigation();
  const [backendMessage, setBackendMessage] = useState('');
  const [dbMessage, setDbMessage] = useState('');

  const callProtectedBackend = async () => {
    try {
      const res = await getProtected();
      setBackendMessage(res.message || JSON.stringify(res));
    } catch (err: any) {
      setBackendMessage(`Failed: ${err.message || 'Connection error'}`);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile();
      setBackendMessage(`Profile: ${JSON.stringify(res.userProfile || res)}`);
    } catch (err: any) {
      setBackendMessage(`Failed: ${err.message || 'Connection error'}`);
    }
  };

  const testDatabase = async () => {
    try {
      const response = await api.get<DbTestResponse>('/api/db-test');
      setDbMessage(response.message || 'DB test successful');
    } catch (error: any) {
      setDbMessage(`Failed: ${error.message || 'Connection error'}`);
    }
  };

  return (
    <View>
      <Text style={{ marginBottom: 10 }}>
        Welcome, {user?.email || 'Guest'}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Movie (Test)"
          onPress={() => navigation.navigate('MovieChosen' as never)}
        />
        <Button title="Call Protected Backend" onPress={callProtectedBackend} />
        <Button title="Get User Profile" onPress={fetchUserProfile} />
        <Button title="Test DB" onPress={testDatabase} />
        <Button title="Events Page" onPress={() => router.push('/events')} />
      </View>
      {backendMessage ? (
        <Text style={styles.result}>{backendMessage}</Text>
      ) : null}
      {dbMessage ? <Text style={styles.result}>{dbMessage}</Text> : null}
      <Button
        title="Sign Out"
        onPress={() => {
          setBackendMessage('');
          onSignOut();
        }}
      />
    </View>
  );
};

export default UserDashboard;

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 20,
    gap: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});
