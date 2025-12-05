import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StyleSheet,
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
  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);
  const { user } = useAuth();

  const handleLongFormSubmit = async (formData: LongPostFormData) => {
    const payload: PostFormData = {
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
  };

  const handleShortFormSubmit = async (formData: ShortPostFormData) => {
    const payload: PostFormData = {
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {postType === 'long' ? (
            <LongPostForm
              preselectedMovie={preselectedMovie}
              onToolbarAction={handleToolbarAction}
              onSubmit={handleLongFormSubmit}
            />
          ) : (
            <ShortPostForm
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
});
