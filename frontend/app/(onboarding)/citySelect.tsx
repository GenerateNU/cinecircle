import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';
import BackButton from '../../components/BackButton';
import { useOnboarding } from './_layout';

const { width, height } = Dimensions.get('window');

export default function CitySelect() {
  const [city, setCity] = useState('');
  const { updateData } = useOnboarding();

  const handleNext = () => {
    updateData({ city });
    router.push('genreSelect');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer}>
          <BackButton onPress={() => router.back()}/>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInputComponent
          title="What city?"
          placeholder="Start typing where you're from!"
          onChangeText={setCity}
          value={city}
        />
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
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.06,
    left: width * 0.05,
    zIndex: 10,
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
});