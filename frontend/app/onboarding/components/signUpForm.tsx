import NextButton from "../../../components/NextButton";
import TextInputComponent from "../../../components/TextInputComponent";
import { useState } from 'react';
import { router } from "expo-router";
import { View } from "react-native";
import { supabase } from '../../../lib/supabase';

type Props = {
  onAuthSuccess: (user: any) => void;
};

const SignUpForm = ({ onAuthSuccess }: Props ) => {
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

    return (
      <View>
        <TextInputComponent/>
        <TextInputComponent/>
      </View>
    )
};

export default SignUpForm; 