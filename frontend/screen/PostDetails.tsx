import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';

export type PostDetailsProps = {
  postId: string;
};

export default function PostDetails({ postId }: PostDetailsProps) {
  // Hardcoded post data for now - will be replaced with API call later
  const hardcodedPost = {
    id: postId,
    userId: 'user-123',
    content: 'This is a sample post content. Clicking on a post from the home feed will navigate here!',
    type: 'SHORT' as const,
    createdAt: new Date().toISOString(),
    imageUrls: [] as string[],
    UserProfile: {
      userId: 'user-123',
      username: 'sample_user',
    },
  };

  const hasImages = hardcodedPost.imageUrls && hardcodedPost.imageUrls.length > 0;
  const username = hardcodedPost.UserProfile?.username || 'Unknown User';
  const userName = username; // You can add a display name field later

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header with back button */}
      <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`mr-4`}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold`}>Post Details</Text>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`px-4 pt-4`}>
          {hasImages ? (
            <PicturePost
              userName={userName}
              username={username}
              date={formatDate(hardcodedPost.createdAt)}
              content={hardcodedPost.content}
              imageUrls={hardcodedPost.imageUrls}
              userId={hardcodedPost.userId}
            />
          ) : (
            <TextPost
              userName={userName}
              username={username}
              date={formatDate(hardcodedPost.createdAt)}
              content={hardcodedPost.content}
              userId={hardcodedPost.userId}
            />
          )}

          {/* Placeholder for comments section - will be added later */}
          <View style={tw`mt-6 pt-4 border-t border-gray-200`}>
            <Text style={tw`text-lg font-semibold mb-2`}>Comments</Text>
            <Text style={tw`text-sm text-gray-500`}>
              Comments section will be implemented here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
