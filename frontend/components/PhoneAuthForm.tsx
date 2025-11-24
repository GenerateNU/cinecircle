import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Props = {
  onAuthSuccess: (user: any) => void;
};

const PhoneAuthForm = ({ onAuthSuccess }: Props) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!phone) {
      setMessage('Please enter a phone number');
      return;
    }

    // Validate phone format (must include country code)
    if (!phone.startsWith('+')) {
      setMessage('Phone number must include country code (e.g., +1234567890)');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone.trim(),
        options: { channel: 'whatsapp' },
      });

      if (error) {
        setMessage(`Error sending OTP: ${error.message}`);
        console.error('OTP send error:', error);
      } else {
        setOtpSent(true);
        setMessage('OTP sent via WhatsApp! Check your phone.');
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`);
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone.trim(),
        token: otp.trim(),
        type: 'sms', // Use 'sms' type even for WhatsApp OTP
      });

      if (error) {
        setMessage(`Verification error: ${error.message}`);
        console.error('OTP verification error:', error);
      } else if (data.user) {
        setMessage('Successfully verified! Logging in...');
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err}`);
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Authentication (WhatsApp OTP)</Text>

      {!otpSent ? (
        <>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.hint}>
            Include country code (e.g., +1234567890)
          </Text>
          <TextInput
            placeholder="+1234567890"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            editable={!loading}
          />
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <Button title="Send WhatsApp OTP" onPress={sendOTP} />
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Enter OTP Code</Text>
          <Text style={styles.hint}>
            Check WhatsApp for the verification code
          </Text>
          <TextInput
            placeholder="123456"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.input}
            editable={!loading}
            maxLength={6}
          />
          <View style={styles.buttonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <>
                <Button title="Verify OTP" onPress={verifyOTP} />
                <View style={styles.spacer} />
                <Button
                  title="Change Number"
                  onPress={resetForm}
                  color="#666"
                />
              </>
            )}
          </View>
        </>
      )}

      {message ? (
        <Text
          style={[
            styles.message,
            message.includes('error') || message.includes('Error')
              ? styles.errorMessage
              : styles.successMessage,
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

export default PhoneAuthForm;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
  },
  successMessage: {
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
  },
  errorMessage: {
    color: '#842029',
    backgroundColor: '#f8d7da',
  },
});
