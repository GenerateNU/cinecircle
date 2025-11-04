import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getProtected, getUserProfileBasic } from '../services/userService';
import { api } from '../services/apiClient';
import type { DbTestResponse } from '../types/apiTypes';

type Props = {
  user: any;
  onSignOut: () => void;
};

const UserDashboard = ({ user, onSignOut }: Props) => {
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

  const getUserProfile = async () => {
    try {
      const res = await getUserProfileBasic();
      setBackendMessage(`Profile: ${JSON.stringify(res.user || res)}`);
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
        <Button title="Call Protected Backend" onPress={callProtectedBackend} />
        <Button title="Get User Profile" onPress={getUserProfile} />
        <Button title="Test DB" onPress={testDatabase} />
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
