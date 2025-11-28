import React, { useState, useRef } from 'react';
import { SafeAreaView, ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import CreatePostBar from '../components/CreatePostBar';
import PostTypeSelector from '../components/PostTypeSelector';
import ShortPostForm from '../components/ShortPostForm';
import LongPostForm from '../components/LongPostForm';
import { createPost } from "../services/postService";
import { useAuth } from '../context/AuthContext';

export interface PostFormData {
  content: string;
  rating?: number;
  title?: string;
  subtitle?: string;
  tags?: string[];
}

export default function PostScreen() {
  const [postType, setPostType] = useState<'long' | 'short' | 'rating' | null>(null);
  const [showStars, setShowStars] = useState(false);

  const longFormRef = useRef<any>(null);
  const shortFormRef = useRef<any>(null);

  const { user } = useAuth();

const handleFormSubmit = async (formData: PostFormData) => {
  try {
    const payload = {
      ...formData,
      userId: user.id,
      postType: postType === "long" ? "LONG_POST" : "SHORT_POST",
    };
     console.log("Payload I'm sending:", payload);
    const post = await createPost(payload);

    console.log("Post created:", post);

    setPostType(null);
  } catch (err) {
    console.error("createPost error:", JSON.stringify(err, null, 2));
  }
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
