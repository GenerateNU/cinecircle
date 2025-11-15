import { View, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';

const { width, height } = Dimensions.get('window')

export default function CitySelect() {
    const [city, setCity] = useState('');
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        updateData({ city });
        go("/(onboarding)/genreSelect");
    };

    return (
        <View style={styles.container}>
            <View>
                <TextInputComponent
                    title="What city?"
                    placeholder="Start typing where you're from!"
                    onChangeText={setCity}
                    value={city}
                />
            </View>
            <View style={styles.buttonContainer}>
                <NextButton onPress={handleNext} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.2,
        paddingBottom: height * 0.1,
    },
    inputWrapper: {
        width: '100%',
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 'auto',
        alignItems: 'center',
    },
});