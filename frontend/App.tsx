import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [message, setMessage] = useState('');
  const [dbMessage, setDbMessage] = useState('');

  const pingBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ping');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to connect to backend');
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
    <View style={styles.container}>
      <Text style={styles.title}>CineCircle Frontend</Text>
      <Button title="Ping Backend" onPress={pingBackend} />
      <Text style={styles.result}>{message}</Text>
      <Button title="Test Database" onPress={testDatabase} />
      <Text style={styles.result}>{dbMessage}</Text>

      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});
