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
  Button,
  ScrollView,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import { router } from 'expo-router'; // ← Expo Router navigation
import LongPostForm from './Posts/LongPostForm';
import ShortPostForm from './Posts/ShortPostForm';
import RatingPostForm from './Posts/RatingPostForm'
import PostTypeSelector from '../components/PostTypeSelector'
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface PostData {
  title: string;
  content: string;
  rating: number;
}

export default function PostScreen() {
  const [postType, setPostType] = useState<'long' | 'short' | 'rating' | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const renderPostContent = () => {
    console.log(postType)
    switch (postType) {
      case 'short':
        return <ShortPostForm />;
      case 'long': 
        return <LongPostForm />;
      case 'rating':
        return <RatingPostForm />;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}}> {renderPostContent()} </ScrollView>

      {postType === null ? (
        <PostTypeSelector value={postType} onChange={setPostType}/>
       ) : (
         <>
         <TouchableOpacity onPress={() => setPostType(null)}>
           <Text>Back</Text>
         </TouchableOpacity>
         {postType === 'short' && <ShortPostForm />}
         {postType === 'long' && <LongPostForm />}
         {postType === 'rating' && <RatingPostForm />}
         </>
     )}
      
      <BottomNavBar/>
    </SafeAreaView>
  );
}
