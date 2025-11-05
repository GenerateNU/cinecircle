import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import ProfilePage from '../screen/ProfilePage';
import Events from './Events'

type Props = {
  user: any;
  onSignOut: () => void;
};

const mockUser = {
  name: 'Kaamil Thobani',
  username: 'kaamil_t',
  bio: 'South Asian cinema enthusiast 🎬 | SRK forever ❤️',
  followers: 1520,
  following: 24,
  profilePic: 'https://i.pravatar.cc/150?img=3', // random avatar generator
};

const UserDashboard = ({ user, onSignOut }: Props) => {
  const [backendMessage, setBackendMessage] = useState('');
  const [dbMessage, setDbMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showEvents, setShowEventsPage] = useState(false);

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

  if (showProfile) {
    return (
      <View style={{ flex: 1 }}>
        <Button
          title="← Back to Dashboard"
          onPress={() => setShowProfile(false)}
        />
        <ProfilePage user={mockUser} />
      </View>
    );
  }

  if (showEvents) {
    return (
      <View style={{ flex: 1 }}>
        <Button
          title="← Back to Dashboard"
          onPress={() => setShowEventsPage(false)}
        />
        <Events />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ marginBottom: 10 }}>Welcome, {user.email}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Call Protected Backend" onPress={callProtectedBackend} />
        <Button title="Get User Profile" onPress={getUserProfile} />
        <Button title="Test DB" onPress={testDatabase} />
        <Button title="Profile Page" onPress={() => setShowProfile(true)} />
        <Button title="Events Page" onPress={() => setShowEventsPage(true)} />

        {/* <Button title="Profile" onPress={profilePage} /> */}
      </View>
      {backendMessage ? (
        <Text style={styles.result}>{backendMessage}</Text>
      ) : null}
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
