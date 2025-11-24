import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';
import BackButton from '../../components/BackButton';

const { width, height } = Dimensions.get('window');

const Username = () => {
  const [username, setUsername] = useState('');
  const { updateData } = useOnboarding();

  const handleNext = () => {
    updateData({ username });
    router.push('profileSelect');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer}>
          <BackButton onPress={() => router.back()}/>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInputComponent
          title="Set your username"
          subtitle="This is how others on the app will recognize you"
          field="Username"
          placeholder="Choose a username"
          onChangeText={setUsername}
          value={username}
        />
      </View>
      <View style={styles.buttonContainer}>
        <NextButton onPress={handleNext} />
      </View>
    </View>
  );
};

export default Username;

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