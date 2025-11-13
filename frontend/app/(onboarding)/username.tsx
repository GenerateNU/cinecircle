import { View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';

export default function Username() {
    const [username, setUsername] = useState('');
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        updateData({ username });
        go("/(onboarding)/profileSelect");
    };

    return (
        <View>
            <TextInputComponent
                title="Set your username"
                field="Username"
                placeholder="Choose a username"
                onChangeText={setUsername}
                value={username}
            />
            <NextButton onPress={handleNext}/>
        </View>
    );
}