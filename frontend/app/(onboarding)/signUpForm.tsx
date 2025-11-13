import NextButton from "../../components/NextButton";
import TextInputComponent from "../../components/TextInputComponent";
import { useState } from 'react';
import { router } from "expo-router";
import { Text, View } from "react-native";
import { supabase } from '../../lib/supabase';
import { useOnboarding } from './_layout';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { updateData } = useOnboarding();

    const signUp = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(`Sign-up error: ${error.message}`);
        setLoading(false);
        return;
      }

      // Save email/password to onboarding context
      updateData({ email, password });

      if (data.user && !data.user.email_confirmed_at) {
        setMessage('Please check your email for the confirmation link!');
      } else {
        setMessage('Account created successfully!');
      }

      // Wait 2 seconds before navigating
      setTimeout(() => {
        setLoading(false);
        router.push("/onboarding/confirm-email");
      }, 2000);
    };

    return (
        <View>
            <TextInputComponent 
                title="Create Your Account"
                field="Email"
                placeholder="example@gmail.com"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
            />
            <TextInputComponent
                field="Password"
                placeholder="enter password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />
            <NextButton onPress={signUp} disabled={loading} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
};

export default SignUpForm;