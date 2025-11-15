import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import StarRating from './StarRating';

const LongPostForm = forwardRef((_, ref) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    submit: () => {
      console.log('Long Post Submitted:', { title, subtitle, content, rating });
    }
  }));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        placeholder="Add a title..."
        placeholderTextColor="#C4C4C4"
        value={title}
        onChangeText={setTitle}
      />

      <StarRating
        rating={rating}
        onRatingChange={setRating}
      />

      <TextInput
        style={styles.subtitle}
        placeholder="Add a subtitle..."
        placeholderTextColor="#C4C4C4"
        value={subtitle}
        onChangeText={setSubtitle}
      />

      <TextInput
        style={styles.body}
        multiline
        placeholder="Start sharing your thoughts..."
        placeholderTextColor="#C4C4C4"
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
});

export default LongPostForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
