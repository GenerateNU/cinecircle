import NextButton from "../components/NextButton";
import TextInputComponent from "../components/TextInputComponent";
import { useState } from 'react';
import { Text, View } from "react-native";
import { supabase } from '../lib/supabase';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (data.user) {
            setMessage('Signed in successfully!');
            // Navigate to main app
            return { success: true };
        }

        return { success: false, error };
    };

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            // User already exists
            if (error.message.includes('already registered')) {
                setMessage('An account with this email already exists. Please check your password and try again.');
                return { success: false, userExists: true };
            }
            
            setMessage(`Sign-up error: ${error.message}`);
            return { success: false, userExists: false };
        }

        // Sign-up succeeded
        if (data.user && !data.user.email_confirmed_at) {
            setMessage('Account created! Please check your email for the confirmation link.');
        } else if (data.user) {
            setMessage('Account created successfully!');
        }

        return { success: true };
    };

    const dispatchSignUp = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            // First, try to sign in
            const signInResult = await handleSignIn();
            
            if (signInResult.success) {
                return;
            }

            // If sign-in failed, try to sign up
            await handleSignUp();

        } catch (error) {
            setMessage('An unexpected error occurred');
        } finally {
            setLoading(false);
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
                keyboardType="email-address"
            />
            <TextInputComponent
                field="Password"
                placeholder="enter password"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
            />
            <NextButton onPress={dispatchSignUp} disabled={loading} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
};

export default SignUp;