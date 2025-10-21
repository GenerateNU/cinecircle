import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import EventDetails from './EventDetails';

type Props = {
  onAuthSuccess: (user: any) => void;
};

const AuthForm = ({ onAuthSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Sign-up error: ${error.message}`);
      return;
    }

    if (data.user && !data.user.email_confirmed_at) {
      setMessage('Please check your email for the confirmation link!');
    } else {
      onAuthSuccess(data.user);
      setMessage('Account created successfully!');
    }
  };

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Sign-in error: ${error.message}`);
      return;
    }

    onAuthSuccess(data.user);
    setMessage('Signed in successfully!');
  };

  return (
    <>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={signUp} />
        <Button title="Sign In" onPress={signIn} />
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
