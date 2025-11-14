import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';
import { useOnboarding } from './_layout';

const GENRES = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
    'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy',
    'Crime', 'Mystery', 'Adventure', 'Musical', 'War'
];

export default function GenreSelect() {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const { updateData } = useOnboarding();
    const go = (to: string) => router.push(to);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleNext = () => {
        updateData({ favoriteGenres: selectedGenres });
        go("/(onboarding)/complete");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What genres do you like?</Text>
            <Text style={styles.subtitle}>Select at least one</Text>
            
            <ScrollView style={styles.tagContainer}>
                {GENRES.map((genre) => (
                    <Tag
                        key={genre}
                        label={genre}
                        pressed={selectedGenres.includes(genre)}
                        onPress={() => toggleGenre(genre)}
                    />
                ))}
            </ScrollView>

            <NextButton 
                onPress={handleNext}
                disabled={selectedGenres.length === 0}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
    tagContainer: { flex: 1, marginBottom: 20 },
});