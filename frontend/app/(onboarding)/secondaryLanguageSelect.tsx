import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';
import { useOnboarding } from './_layout';
import { MaterialIcons } from "@expo/vector-icons";

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic',
    'Hindi', 'Russian', 'Turkish', 'Dutch', 'Swedish'
];

export default function SecondaryLanguageSelect() {
    const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
    const { updateData, data } = useOnboarding();
    const go = (to: string) => router.push(to);

    const toggleLanguage = (lang: string) => {
        setSelectedLanguage(prev => 
            prev.includes(lang) 
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    const handleNext = () => {
        updateData({ secondaryLanguage: selectedLanguage });
        go("/(onboarding)/countrySelect");
    };

    const handleBack = () => {
        if (selectedLanguage) {
            updateData({ secondaryLanguage: selectedLanguage });
        }
        router.back();
    };

    // Filter out primary language
    const availableLanguages = LANGUAGES.filter(lang => lang !== data.primaryLanguage);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => handleBack()}>
                <MaterialIcons name="arrow-left" />
            </TouchableOpacity>
            <Text style={styles.title}>Any other languages? (Optional)</Text>
            
            <ScrollView style={styles.tagContainer}>
                {availableLanguages.map((lang) => (
                    <Tag
                        key={lang}
                        label={lang}
                        pressed={selectedLanguage.includes(lang)}
                        onPress={() => toggleLanguage(lang)}
                    />
                ))}
            </ScrollView>

            <NextButton onPress={handleNext} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    tagContainer: { flex: 1, marginBottom: 20 },
});