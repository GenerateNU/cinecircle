import { View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';

export default function CitySelect() {
    const [city, setCity] = useState('');
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        updateData({ city });
        go("/(onboarding)/genreSelect");
    };

    return (
        <View>
            <TextInputComponent
                title="What city?"
                placeholder="Start typing where you're from!"
                onChangeText={setCity}
                value={city}
            />
            <NextButton onPress={handleNext} />
        </View>
    );
}