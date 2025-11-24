import NextButton from "../../components/NextButton";
import TextInputComponent from "../../components/TextInputComponent";
import { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { supabase } from '../../lib/supabase';
import BackButton from "../../components/BackButton";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validateInputs = (): { valid: boolean; error?: string } => {
        if (!email || !password) {
            return { valid: false, error: 'Please fill in all fields' };
        }

        if (!email.includes('@')) {
            return { valid: false, error: 'Please enter a valid email address' };
        }

        return { valid: true };
    };

    const handleLogin = async () => {
        const validation = validateInputs();
        if (!validation.valid) {
            setMessage(validation.error || 'Invalid input');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                console.error('Full error object:', JSON.stringify(error, null, 2));
                console.error('Error name:', error.name);
                console.error('Error status:', error.status);
                setMessage(`Login error: ${error.message}`);
                return;
            }

            if (data.user) {
                console.log('Login successful:', data.user.id);
                setMessage('Signed in successfully!');
            }
        } catch (error) {
            console.error('Caught exception:', error);
            setMessage('An unexpected error occurred');
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
                    title="Welcome Back"
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
                <Text style={styles.message}>{message || ' '}</Text>
            </View>

            <NextButton 
                onPress={handleLogin} 
                disabled={loading} 
                size="large"
            />
        </View>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        top: height * 0.06,
        left: width * 0.05,
        zIndex: 10,
    },
    inputWrapper: {
        width: '100%',
        marginTop: '30%',
        gap: height * 0.02,
    },
    message: {
        marginTop: 10,
        color: '#666',
        textAlign: 'center',
        minHeight: 40,
    }
});