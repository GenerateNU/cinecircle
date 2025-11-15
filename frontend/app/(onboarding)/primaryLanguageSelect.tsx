import { View, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';
import DropdownSelect from './components/dropdownSelect';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
    'English', 'Tamil', 'Hindi', 
    'Urdu', 'Malayalam', 'Telegu'
];

export default function PrimaryLanguageSelect() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const { updateData } = useOnboarding();

    const handleNext = () => {
        if (selectedLanguage) {
            updateData({ primaryLanguage: selectedLanguage });
            router.push("/(onboarding)/secondaryLanguageSelect");
        }
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.inputWrapper}>
                <DropdownSelect 
                    title="Select your primary language"
                    items={LANGUAGES} 
                    onSelect={setSelectedLanguage}
                    selectedValue={selectedLanguage || undefined}
                    placeholder="Select Your Primary Language"
                />
            </View>

            <View style={styles.buttonContainer}>
                <NextButton 
                    onPress={handleNext}
                    disabled={!selectedLanguage}
                />
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
    message: {
        marginTop: 10,
        color: '#666',
        textAlign: 'center',
    }
});