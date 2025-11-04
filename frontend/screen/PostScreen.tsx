import { useState } from 'react';
import StarRating from '../components/StarRating';
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import PostTypeSelector from '../components/PostTypeSelector';
import CreatePostBar from '../components/CreatePostBar';
import PostForm from '../components/PostForm';

interface PostData {
  title: string;
  content: string;
  rating: number;
}

export default function PostScreen() {
  const [postType, setPostType] = useState<'long' | 'short' | 'rating' | null>(
    null
  );

  const handleSubmit = (data: {
    title: string;
    content: string;
    rating: number;
  }) => {
    console.log('Post submitted:', data);
    setPostType(null);
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
          <StarRating
            initialRating={5}
            onRatingChange={rating => setRating(rating)}
          />

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
