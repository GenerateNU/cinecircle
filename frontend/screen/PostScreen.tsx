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

  // Handles creating post (fetch/axios logic goes here)
  const handleFormSubmit = () => {
    // implement your fetch call here
    // fetch('/post', {body: JSON.stringify(formData), ... })
    //console.log("Form submitted data:", formData);
  };

  const handleSubmitButton = () => {
    if (postType === 'long') {
      longFormRef.current?.submit();
    } else if (postType === 'short') {
      shortFormRef.current?.submit();
    }
  };

  const handleToolbarAction = (action: string) => {
    if (action === 'rating') setShowStars(prev => !prev);
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
            onSubmit={handleSubmitButton}
          />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {postType === 'long' && (
                <LongPostForm
                  ref={longFormRef}
                  showTextBox
                  showStars={showStars}
                  onToolbarAction={handleToolbarAction}
                  onSubmit={handleFormSubmit}
                />
              )}

              {postType === 'short' && (
                <ShortPostForm
                  ref={shortFormRef}
                  showTextBox
                  showStars={showStars}
                  onToolbarAction={handleToolbarAction}
                  onSubmit={handleFormSubmit}
                />
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}
