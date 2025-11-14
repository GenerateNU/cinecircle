import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';
import { MaterialIcons } from "@expo/vector-icons";
import DropdownSelect from './components/dropdownSelect';

const LANGUAGES = [
    'English', 'Tamil', 'Hindi', 
    'Urdu', 'Malayalam', 'Telegu'
];

export default function PrimaryLanguageSelect() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        if (selectedLanguage) {
            updateData({ primaryLanguage: selectedLanguage });
            go("/(onboarding)/secondaryLanguageSelect");
        }
    };

    const handleBack = () => {
        if (selectedLanguage) {
            updateData({ primaryLanguage: selectedLanguage });
        }
        router.back();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack}>
                <MaterialIcons name="arrow-left" size={24} />
            </TouchableOpacity>

            <Text style={styles.title}>Select Your Primary Language</Text>
            <DropdownSelect 
                items={LANGUAGES} 
                onSelect={setSelectedLanguage}
                selectedValue={selectedLanguage || undefined}
                placeholder="Select Your Primary Language"
            />

            <NextButton 
                onPress={handleNext}
                disabled={!selectedLanguage}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    tagContainer: { flex: 1, marginBottom: 20 },
});
