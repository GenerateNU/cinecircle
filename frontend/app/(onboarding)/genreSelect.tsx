import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';
import { useOnboarding } from './_layout';

const { width, height } = Dimensions.get('window');

const GENRES = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
  'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy',
  'Crime', 'Mystery', 'Adventure', 'Musical', 'War'
];

export default function GenreSelect() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const { updateData } = useOnboarding();

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleNext = () => {
    updateData({ favoriteGenres: selectedGenres });
    router.push('complete');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.title}>What genres do you like?</Text>
        <Text style={styles.subtitle}>Select at least one</Text>
        
        <ScrollView style={styles.tagContainer}>
          <View style={styles.tagWrapper}>
            {GENRES.map((genre) => (
              <Tag
                key={genre}
                label={genre}
                pressed={selectedGenres.includes(genre)}
                onPress={() => toggleGenre(genre)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <NextButton 
          onPress={handleNext}
          disabled={selectedGenres.length === 0}
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
  title: {
    fontSize: width * 0.06,
    fontWeight: '500',
    marginBottom: height * 0.01,
    color: '#D62E05',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#888888',
    marginBottom: height * 0.02,
  },
  tagContainer: {
    flex: 1,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: width * 0.02,
  },
});