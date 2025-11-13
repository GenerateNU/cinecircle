import NextButton from "../../components/NextButton";
import TextInputComponent from "../../components/TextInputComponent";
import { router } from "expo-router"
import { useState } from 'react';
import { Text, View } from "react-native";
import { supabase } from '../../lib/supabase';

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
            // OnboardingGuard will handle navigation
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

        if (!data.user) {
            return { success: false }
        }

        return {
            success: true,
            confirmation: !!data.user.email_confirmed_at
        };
    };

    const dispatchSignUp = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            // First, try to sign in
            const signInResult = await handleSignIn();
            
            if (signInResult.success) {
                // OnboardingGuard will redirect based on profile.onboardingCompleted
                return;
            }

            // If sign-in failed, try to sign up
            const signUpResult = await handleSignUp();

            if (signUpResult.success) {
                if (signUpResult.confirmation) {
                    // Email confirmed, OnboardingGuard will redirect to onboarding
                    return;
                }

                if (signUpResult.confirmation === false) {
                    // Need email confirmation
                    router.replace("/(auth)/confirmEmail");
                    return;
                }
            }

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
