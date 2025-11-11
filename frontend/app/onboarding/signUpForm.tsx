import NextButton from "../../components/NextButton"
import TextInputComponent from "../../components/TextInputComponent"
import { useState } from 'react'
import { router } from "expo-router"
import { Text, View } from "react-native"
import { supabase } from '../../lib/supabase'

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const go = (to: string) => router.push(to);

    const signUp = async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(`Sign-up error: ${error.message}`);
        return;
      };

      // If stuff breaks it's probably this block
      if (data.user && data.user.email_confirmed_at) {
        setMessage('Account created successfully!');
        go("onboarding/username");
      } else {
        setMessage('Please check your email for the confirmation link!' + data.user);
      };
    };

    return (
        <View>
            <TextInputComponent 
                title="Create Your Account"
                field="Email"
                placeholder="example@gmail.com"
                onChangeText={setEmail}
            />
            <TextInputComponent
                field="Password"
                placeholder="enter password"
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <NextButton onPress={signUp}/>
            {message ? <Text>{message}</Text> : null}
        </View>
    )
}

export default SignUpForm;
