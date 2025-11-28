import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';
import Tag from '../../components/Tag';
import { useOnboarding } from './_layout';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic',
  'Hindi', 'Russian', 'Turkish', 'Dutch', 'Swedish'
];

export default function SecondaryLanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const { updateData, data } = useOnboarding();

  const toggleLanguage = (lang: string) => {
    setSelectedLanguage(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  const handleNext = () => {
    updateData({ secondaryLanguage: selectedLanguage });
    router.push('countrySelect');
  };

  // Filter out primary language
  const availableLanguages = LANGUAGES.filter(lang => lang !== data.primaryLanguage);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer}>
        <BackButton onPress={() => router.back()}/>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <Text style={styles.title}>Any other languages? (Optional)</Text>
        
        <ScrollView style={styles.tagContainer}>
          <View style={styles.tagWrapper}>
            {availableLanguages.map((lang) => (
              <Tag
                key={lang}
                label={lang}
                pressed={selectedLanguage.includes(lang)}
                onPress={() => toggleLanguage(lang)}
              />
            ))}
          </View>
        </ScrollView>
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
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    zIndex: 10,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '500',
    marginBottom: height * 0.02,
    color: '#D62E05',
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