import NextButton from "../components/NextButton";
import TextInputComponent from "../components/TextInputComponent";
import { useState } from 'react';
import { Text, View } from "react-native";
import { supabase } from '../lib/supabase';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setMessage('');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage(`Login error: ${error.message}`);
                setLoading(false);
                return;
            }

            if (data.user) {
                setMessage('Signed in successfully!');
                // Navigate to main app
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
            <NextButton onPress={handleLogin} disabled={loading} />
            {message ? <Text>{message}</Text> : null}
        </View>
    );
};

export default LoginForm;