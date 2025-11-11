import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';
import { useOnboarding } from './_layout';

const LANGUAGES = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic',
    'Hindi', 'Russian', 'Turkish', 'Dutch', 'Swedish'
];

export default function SecondaryLanguageSelect() {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const { updateData, data } = useOnboarding();
    const go = (to: string) => router.push(to);

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages(prev => 
            prev.includes(lang) 
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    const handleNext = () => {
        updateData({ secondaryLanguages: selectedLanguages });
        go("/onboarding/countrySelect");
    };

    // Filter out primary language
    const availableLanguages = LANGUAGES.filter(lang => lang !== data.language);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Any other languages? (Optional)</Text>
            
            <ScrollView style={styles.tagContainer}>
                {availableLanguages.map((lang) => (
                    <Tag
                        key={lang}
                        label={lang}
                        pressed={selectedLanguages.includes(lang)}
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