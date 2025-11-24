import NextButton from "../../components/NextButton";
import TextInputComponent from "../../components/TextInputComponent";
import { router } from "expo-router"
import { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { supabase } from '../../lib/supabase';
import BackButton from "../../components/BackButton";

const { width, height } = Dimensions.get('window');

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = (): { valid: boolean; error?: string } => {
        if (!email || !password || !confirmPassword) {
            return { valid: false, error: 'Please fill in all fields' };
        }

        if (!email.includes('@')) {
            return { valid: false, error: 'Please enter a valid email address' };
        }

        if (password.length < 6) {
            return { valid: false, error: 'Password must be at least 6 characters' };
        }

        if (password !== confirmPassword) {
            return { valid: false, error: 'Passwords do not match' };
        }

        return { valid: true };
    };

    const handleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // OnboardingGuard will handle navigation
                return { success: true };
            }

            return { success: false, error: 'Sign in failed' };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred during sign in' };
        }
    };

    const handleSignUp = async () => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                // User already exists
                if (error.message.includes('already registered')) {
                    return { 
                        success: false, 
                        userExists: true, 
                        error: 'An account with this email already exists. Please try signing in.' 
                    };
                }
                
                return { success: false, error: error.message };
            }

            if (!data.user) {
                return { success: false, error: 'Sign up failed - no user created' };
            }

            return {
                success: true,
                emailConfirmed: !!data.user.email_confirmed_at
            };
        } catch (error) {
            return { success: false, error: 'An unexpected error occurred during sign up' };
        }
    };

    const dispatchSignUp = async () => {
        // Validate inputs first
        const validation = validateInputs();
        if (!validation.valid) {
            setMessage(validation.error || 'Invalid input');
            return;
        }

        setLoading(true);
        setMessage('');
        
        try {
            // First, attempt sign in (user might already exist)
            const signInResult = await handleSignIn();
            
            if (signInResult.success) {
                setMessage('Signed in successfully!');
                // OnboardingGuard will redirect based on profile.onboardingCompleted
                return;
            }

            // Sign in failed, attempt sign up
            const signUpResult = await handleSignUp();

            if (signUpResult.success) {
                if (signUpResult.emailConfirmed) {
                    setMessage('Account created successfully!');
                    // OnboardingGuard will redirect to onboarding
                } else {
                    // Need email confirmation
                    setMessage('Please check your email to confirm your account');
                    router.replace("/(auth)/confirmEmail");
                }
            } else {
                // Sign up failed
                if (signUpResult.userExists) {
                    // Try signing in again with better error message
                    setMessage(signUpResult.error || 'Account exists. Please check your password.');
                } else {
                    setMessage(signUpResult.error || 'Sign up failed. Please try again.');
                }
            }

        } catch (error) {
            setMessage('An unexpected error occurred. Please try again.');
            console.error('Sign up error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButtonContainer}>
                <BackButton onPress={() => router.back()}/>
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
                <TextInputComponent 
                    title="Create Your Account"
                    subtitle="Enter Your Info"
                    field="Email"
                    placeholder="example@gmail.com"
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                />
                <TextInputComponent
                    field="Password"
                    placeholder="enter password"
                    subtext="Password must be at least 8 characters"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                <TextInputComponent
                    field="Confirm Password"
                    placeholder="confirm password"
                    subtext="Password must be at least 8 characters"
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    secureTextEntry={true}
                />
                <Text style={styles.message}>{'*'+ message|| ' '}</Text>
            </View>

            <NextButton 
                onPress={dispatchSignUp} 
                title="Create Account"
                disabled={loading} 
            />
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
    },
    backButtonContainer: {
        position: 'absolute',
        top: height * 0.06,
        left: width * 0.05,
        zIndex: 10,
    },
    inputWrapper: {
        width: '100%',
        marginTop: '15%',
        gap: height * 0.02
    },
    message: {
        marginTop: 10,
        color: '#666',
        textAlign: 'center',
    }
});