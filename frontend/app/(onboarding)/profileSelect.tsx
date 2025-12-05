import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import { router } from 'expo-router';
import NextButton from '../../components/NextButton';
import { useOnboarding } from './_layout';
import BackButton from '../../components/BackButton';

const { width, height } = Dimensions.get('window');

export default function ProfileSelect() {
  const { updateData } = useOnboarding();

  const handleNext = () => {
    // Skip profile picture for now
    updateData({ profilePicture: null });
    router.push('primaryLanguageSelect');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonContainer}>
        <BackButton onPress={() => router.back()}/>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <Text style={styles.title}>Profile picture coming soon!</Text>
        <Text style={styles.subtitle}>We'll add this feature later</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: height * 0.01,
    textAlign: 'center',
    color: '#D62E05',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#888888',
    textAlign: 'center',
  },
});