import React, { useState } from 'react';
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
import LongPostForm from './Posts/LongPostForm';
import ShortPostForm from './Posts/ShortPostForm';
import RatingPostForm from './Posts/RatingPostForm'
import PostTypeSelector from '../components/PostTypeSelector'

interface PostData {
  title: string;
  content: string;
  rating: number;
}

export default function PostScreen() {
  const [postType, setPostType] = useState<'long' | 'short' | 'rating'>('long');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const renderPostContent = () => {
    switch (postType) {
      case 'long':
        return <LongPostForm />;
      case 'short':
        return <ShortPostForm />;
      case 'rating':
        return <RatingPostForm />;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}}> {renderPostContent()} </ScrollView>

      <PostTypeSelector value={postType} onChange={setPostType}/>

      <BottomNavBar/>
    </SafeAreaView>
  );
}
