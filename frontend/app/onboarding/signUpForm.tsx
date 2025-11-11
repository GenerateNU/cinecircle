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
    const { updateData } = useOnboarding();

    const go = (to: string) => router.push(to);

    const signUp = async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(`Sign-up error: ${error.message}`);
        return;
      }

      // Save email/password to onboarding context
      updateData({ email, password });

      // If stuff breaks it's probably this block
      if (data.user) {
        setMessage('Account created successfully!');
        go("/onboarding/username");
      } else {
        setMessage('Please check your email for the confirmation link!');
        // add navigation to a pls confirm email screen
      }
    };

    return (
        <View>
            <TextInputComponent 
                title="Create Your Account"
                field="Email"
                placeholder="example@gmail.com"
                onChangeText={setEmail}
                value={email}
            />
            <TextInputComponent
                field="Password"
                placeholder="enter password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />
            <NextButton onPress={signUp}/>
            {message ? <Text>{message}</Text> : null}
        </View>
    );
};

export default SignUpForm;