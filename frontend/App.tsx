import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null)
  const [backendMessage, setBackendMessage] = useState('')
  const [dbMessage, setDbMessage] = useState('');

  useEffect(() => {
    // Check if user already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      }
    })
  }, [])

    const signIn = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setMessage(`Sign-in error: ${error.message}`)
        return
      }

      if (data.user) {
        setUser(data.user)
        setMessage('Signed in successfully!')
        console.log('Signed in:', data)
      } else {
        setMessage('Signed in — no user returned (maybe needs confirmation)');
      }
    }

    const signUp = async () => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: 'https://your-app.com/auth/callback'
        }
      })

      if (error) {
        console.error('Sign-up error:', error.message)
        setMessage(`Sign-up error: ${error.message}`)
        return
      }

      if (data.user && !data.user.email_confirmed_at) {
        setMessage('Please check your email for the confirmation link!')
      } else {
        setUser(data.user)
        setMessage('Account created successfully!')
      }
      console.log('Signed up:', data)
    }

  const callProtectedBackend = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const token = session?.access_token
    if (!token) return setBackendMessage('No token found')

    try {
      const res = await fetch('http://localhost:3001/api/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setBackendMessage(data.message || JSON.stringify(data))
    } catch (err) {
      console.error('Error calling backend:', err)
      setBackendMessage('Failed to connect to backend')
    }
  }

  const getUserProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const token = session?.access_token
    if (!token) return setBackendMessage('No token found')

    try {
      const res = await fetch('http://localhost:3001/api/user/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setBackendMessage(`Profile: ${JSON.stringify(data)}`)
    } catch (err) {
      console.error('Error calling backend:', err)
      setBackendMessage('Failed to connect to backend')
    }
  }

  const testDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/db-test');
      const data = await response.json();
      setDbMessage(data.message);
    } catch (error) {
      setDbMessage('Failed to connect to database');
    }
  };

  const pingBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ping');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to connect to backend');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineCircle Frontend</Text>

      {!user ? (
        <>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={setEmail}
            autoCapitalize='none'
            keyboardType='email-address'
            style={styles.input}
          />
          <TextInput
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" onPress={signUp} />
            <Button title="Sign In" onPress={signIn} />
          </View>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 10 }}>Welcome, {user?.email}</Text>
          <Button title="Sign Out" onPress={async () => {
            await supabase.auth.signOut()
            setUser(null)
            setBackendMessage('')
          }} />
        </>
      )}
      <Button title="Ping Backend" onPress={pingBackend} />
      <Text style={styles.result}>{message}</Text>
      <Button title="Test Database" onPress={testDatabase} />
      <Text style={styles.result}>{dbMessage}</Text>
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
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});