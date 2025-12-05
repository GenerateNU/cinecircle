import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import LongPostForm from '../components/LongPostForm';
import ShortPostForm from '../components/ShortPostForm';
import CreatePostBar from '../components/CreatePostBar';
import { useAuth } from '../context/AuthContext';
import { createPost } from '../services/postService';
import type { components } from '../types/api-generated';

type PostFormData = components['schemas']['PostFormData'];
type LongPostFormData = components['schemas']['LongPostFormData'];
type ShortPostFormData = components['schemas']['ShortPostFormData'];
type Post = components['schemas']['Post'];

export default function PostScreen({
  initialType,
  preselectedMovie,
}: {
  initialType: 'long' | 'short';
  preselectedMovie?: { id: string; title: string } | null;
}) {
  const [postType] = useState<'long' | 'short'>(initialType);
  const [showStars, setShowStars] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);
  const { user } = useAuth();

  const handleLongFormSubmit = async (formData: LongPostFormData) => {
    if (isSubmitting) return;

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a post.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: PostFormData = {
        userId: user.id,
        movieId: formData.movieId,
        content: formData.content,
        type: 'LONG',
        stars: formData.rating || null,
        spoiler: formData.spoiler || false,
        tags: formData.tags || [],
        imageUrls: formData.imageUrls || [],
        repostedPostId: null,
      };

      await createPost(payload);
      router.back();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to create post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShortFormSubmit = async (formData: ShortPostFormData) => {
    if (isSubmitting) return;

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a post.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: PostFormData = {
        userId: user.id,
        movieId: formData.movieId,
        content: formData.content,
        type: 'SHORT',
        stars: null,
        spoiler: formData.spoiler || false,
        tags: [],
        imageUrls: formData.imageUrls || [],
        repostedPostId: null,
      };

      await createPost(payload);
      router.back();
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to create post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitButton = () => {
    if (postType === 'long') {
      longFormRef.current?.submit();
    } else {
      shortFormRef.current?.submit();
    }
  };

  // TO DO - ask in meeting on Wed
  const handleToolbarAction = (action: string) => {
    if (action === 'rating') {
      setShowStars(prev => !prev);
    }
  };

  return (
    <View style={styles.container}>
      <CreatePostBar
        title={postType === 'long' ? 'Create Long' : 'Create Short'}
        onBack={() => router.back()}
        onSubmit={handleSubmitButton}
      />

      {isSubmitting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#e66a4e" />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {postType === 'long' ? (
            <LongPostForm
              ref={longFormRef}
              preselectedMovie={preselectedMovie}
              onToolbarAction={handleToolbarAction}
              onSubmit={handleLongFormSubmit}
            />
          ) : (
            <ShortPostForm
              ref={shortFormRef}
              preselectedMovie={preselectedMovie}
              onToolbarAction={handleToolbarAction}
              onSubmit={handleShortFormSubmit}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
