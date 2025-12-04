import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MovieChosenScreen from '../../screen/MovieChosenScreen';

export default function MovieDetailPage() {
  const router = useRouter();
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  
  if (!movieId) {
    return null;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      
      <MovieChosenScreen movieId={movieId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});