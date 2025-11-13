import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';

export default function ProfileSelect() {
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        // Skip profile picture for now
        updateData({ profilePicture: null });
        go("/(onboarding)/primaryLanguageSelect");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile picture coming soon!</Text>
            <Text style={styles.subtitle}>We'll add this feature later</Text>
            
            <NextButton onPress={handleNext}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
});