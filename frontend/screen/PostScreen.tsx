import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import PostTypeSelector from '../components/PostTypeSelector';
import CreatePostBar from '../components/CreatePostBar';
import PostForm from '../components/PostForm';

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

  const renderPostContent = () => {
    switch (postType) {
      case 'short':
        return <PostForm showTextBox onSubmit={handleSubmit} />;
      case 'long':
        return <PostForm showTitle showTextBox onSubmit={handleSubmit} />;
      case 'rating':
        return (
          <PostForm showTitle showTextBox showStars onSubmit={handleSubmit} />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {postType === null ? (
        <View style={styles.selectorContainer}>
          <PostTypeSelector value={postType} onChange={setPostType} />
        </View>
      ) : (
        <>
          <CreatePostBar onBack={() => setPostType(null)} />
          <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{
                padding: 16,
              }}
            >
              {renderPostContent()}
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  selectorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
