import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';
import DropdownSelect from '../../components/dropdownSelect';
import { useOnboarding } from './_layout';

const { width, height } = Dimensions.get('window');

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'France', 'Germany',
];

export default function CountrySelect() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { updateData } = useOnboarding();

  const handleNext = () => {
    if (selectedCountry) {
      updateData({ country: selectedCountry });
      router.push('citySelect');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer}>
        <BackButton onPress={() => router.back()}/>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <DropdownSelect 
          title="Where are you from?"
          items={COUNTRIES} 
          onSelect={setSelectedCountry}
          selectedValue={selectedCountry || undefined}
          placeholder="Select Your Country"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <NextButton 
          onPress={handleNext}
          disabled={!selectedCountry}
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
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    zIndex: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'center',
  },
});