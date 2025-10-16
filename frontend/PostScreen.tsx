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
  ScrollView
} from 'react-native';

interface PostData {
  title: string;
  content: string;
  rating: number;
}

export default function PostScreen() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  const handleNext = (): void => {
    const postData: PostData = { title, content, rating };
    console.log('Post created:', postData);
    // Add your navigation or submission logic here
  };

  const renderStars = (): JSX.Element => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star: number) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[
              styles.star,
              star <= rating && styles.starFilled
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content}>
          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Add a Title"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />

          {/* Rating Stars */}
          {renderStars()}

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Start sharing your thoughts..."
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Bottom Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>+</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>❞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>↶</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>⌨</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  nextTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingVertical: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  starButton: {
    marginRight: 8,
  },
  star: {
    fontSize: 32,
    color: '#d0d0d0',
  },
  starFilled: {
    color: '#ffd700',
  },
  contentInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 200,
    paddingVertical: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  toolButton: {
    padding: 8,
    marginRight: 16,
  },
  toolIcon: {
    fontSize: 30,
    color: '#666',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
  },
});