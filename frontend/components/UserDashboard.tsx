import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

type Props = {
  user: any;
  onSignOut: () => void;
};

const UserDashboard = ({ user, onSignOut }: Props) => {
  const navigation = useNavigation();
  const [backendMessage, setBackendMessage] = useState('');
  const [dbMessage, setDbMessage] = useState('');

  const callProtectedBackend = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    if (!token) return setBackendMessage('No token found');

    try {
      const res = await fetch('http://localhost:3001/api/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBackendMessage(data.message || JSON.stringify(data));
    } catch (err) {
      setBackendMessage('Failed to connect to backend');
    }
  };

  const getUserProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    if (!token) return setBackendMessage('No token found');

    try {
      const res = await fetch('http://localhost:3001/api/user/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBackendMessage(`Profile: ${JSON.stringify(data)}`);
    } catch (err) {
      setBackendMessage('Failed to connect to backend');
    }
  };

  const testDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/db-test');
      const data = await response.json();
      setDbMessage(data.message);
    } catch (error) {
      setDbMessage('Failed to connect to database');
    }
  };

  return (
    <View>
      <Text style={{ marginBottom: 10 }}>Welcome, {user.email}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Create Post" 
          onPress={() => navigation.navigate('PostScreen' as never)} 
        />
        <Button title="Call Protected Backend" onPress={callProtectedBackend} />
        <Button title="Get User Profile" onPress={getUserProfile} />
        <Button title="Test DB" onPress={testDatabase} />
      </View>
      {backendMessage ? <Text style={styles.result}>{backendMessage}</Text> : null}
      {dbMessage ? <Text style={styles.result}>{dbMessage}</Text> : null}
      <Button
        title="Sign Out"
        onPress={async () => {
          await supabase.auth.signOut();
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
