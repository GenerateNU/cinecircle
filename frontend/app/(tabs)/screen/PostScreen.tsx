import { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import PostTypeSelector from '../../../components/PostTypeSelector';
import CreatePostBar from '../../../components/CreatePostBar';
import PostForm from '../../../components/PostForm';

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
    <SafeAreaView style={{ flex: 1 }}>
      {postType === null ? (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <PostTypeSelector value={postType} onChange={setPostType} />
        </View>
      ) : (
        <>
          <CreatePostBar onBack={() => setPostType(null)} />
          <ScrollView style={{ flex: 1 }}>{renderPostContent()}</ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}