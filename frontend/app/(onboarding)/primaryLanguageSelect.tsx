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

export default function PrimaryLanguageSelect() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        if (selectedLanguage) {
            updateData({ language: selectedLanguage });
            go("/(onboarding)/secondaryLanguageSelect");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What's your primary language?</Text>
            
            <ScrollView style={styles.tagContainer}>
                {LANGUAGES.map((lang) => (
                    <Tag
                        key={lang}
                        label={lang}
                        pressed={selectedLanguage === lang}
                        onPress={() => setSelectedLanguage(lang)}
                    />
                ))}
            </ScrollView>

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