import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';
import DropdownSelect from './components/dropdownSelect';
import { useOnboarding } from './_layout';

const COUNTRIES = [
    'United States', 'Canada', 'United Kingdom', 'France', 'Germany',
    'Spain', 'Italy', 'Japan', 'South Korea', 'China',
    'India', 'Brazil', 'Mexico', 'Australia', 'Argentina'
];

export default function CountrySelect() {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const handleNext = () => {
        if (selectedCountry) {
            updateData({ country: selectedCountry });
            go("/(onboarding)/citySelect");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Where are you from?</Text>
                <DropdownSelect 
                    items={COUNTRIES} 
                    onSelect={setSelectedCountry}
                    selectedValue={selectedCountry || undefined }
                    placeholder="Select Your Primary Language"
                />

            <NextButton 
                onPress={handleNext}
                disabled={!selectedCountry}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    tagContainer: { flex: 1, marginBottom: 20 },
});