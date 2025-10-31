import { useState } from 'react';
import StarRating from '../components/StarRating';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import { router } from 'expo-router'; // ← Expo Router navigation

interface PostData {
  title: string;
  content: string;
  rating: number;
}

export default function PostScreen() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const canPublish = title.trim().length > 0 && content.trim().length > 0;

  const handlePublish = (): void => {
    const postData: PostData = { title, content, rating };
    console.log('Post created:', postData);
    // need to push to backend here
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Post</Text>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={!canPublish}
          style={[styles.nextButton, !canPublish && styles.nextButtonDisabled]}
        >
          <Text
            style={[styles.nextText, !canPublish && styles.nextTextDisabled]}
          >
            Publish
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 120 }} // keep clear of fixed bottom nav
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Add a Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          {/* Rating Stars */}
          <StarRating initialRating={5} onRatingChange={(rating) => setRating(rating)}/>

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Start sharing your thoughts..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Composer toolbar (above bottom nav) */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolIcon}>＋</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolIcon}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolIcon}>❞</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolIcon}>↶</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolButton}>
          <Text style={styles.toolIcon}>⌨</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed Bottom Nav */}
      <View style={styles.bottomBar}>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#000' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  nextButtonDisabled: { backgroundColor: '#ccc' },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  nextTextDisabled: { color: '#999' },

  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 16 },

  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingVertical: 8,
  },
  starsContainer: { flexDirection: 'row', marginBottom: 16 },
  starButton: { marginRight: 8 },
  star: { fontSize: 32, color: '#d0d0d0' },
  starFilled: { color: '#ffd700' },

  contentInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 220,
    paddingVertical: 8,
  },

  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 64, // leave space for BottomNavBar (adjust if your nav is taller)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  toolButton: { padding: 6, marginRight: 8 },
  toolIcon: { fontSize: 28, color: '#666' },
  separator: {
    width: 1,
    height: 22,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
