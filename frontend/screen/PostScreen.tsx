import React, { useState, useRef } from 'react';
import { SafeAreaView, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import CreatePostBar from '../components/CreatePostBar';
import PostTypeSelector from '../components/PostTypeSelector';
import ShortPostForm from '../components/ShortPostForm';
import LongPostForm from '../components/LongPostForm';

export default function PostScreen() {
  const [postType, setPostType] = useState<'long' | 'short' | 'rating' | null>(null);
  const [showStars, setShowStars] = useState(false);

  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);

  const handleSubmit = () => {
    if (postType === 'long') {
      longFormRef.current?.submit();
    } else if (postType === 'short') {
      shortFormRef.current?.submit();
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {postType === null ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <PostTypeSelector value={postType} onChange={setPostType} />
        </View>
      ) : (
        <>
          <CreatePostBar
            title={postType === 'long' ? 'Create Long' : 'Create Short'}
            onBack={() => setPostType(null)}
            onSubmit={handleSubmit}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {postType === 'long' && (
                <LongPostForm ref={longFormRef} 
                showTextBox
                showStars={showStars}
                onSubmit={handleSubmit}
                />
              )}

              {postType === 'short' && (
                <ShortPostForm
                ref={shortFormRef}
                showTextBox
                showStars={showStars}
                onSubmit={handleSubmit}
                />
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}
