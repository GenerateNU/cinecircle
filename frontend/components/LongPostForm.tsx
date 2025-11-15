import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import StarRating from './StarRating';

export interface LongPostFormRef {
  submit: () => void;
}

interface LongPostFormProps {
  showTextBox: boolean;
  showStars: boolean;
  onSubmit: (data: { content: string; rating?: number }) => void;
  onToolbarAction: (action: string) => void;
}

const LongPostForm = forwardRef<LongPostFormRef, LongPostFormProps>(
({ showTextBox, showStars, onSubmit, onToolbarAction }, ref) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

//Exposes the submit function to the parent
  useImperativeHandle(ref, () => ({
    submit() {
      onSubmit({
        content,
        rating: rating || undefined,
      });
    },
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

      <View style={styles.starContainer}>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
        />
      </View>

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

     <View style={styles.toolbar}>
        <TouchableOpacity
        onPress={() => onToolbarAction("rating")}
        style={styles.toolbarItem}
        >
        <Text style={styles.toolbarText}>Rating</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem}>
        <Text style={styles.toolbarText}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem}>
        <Text style={styles.toolbarText}>GIF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem}>
        <Text style={styles.toolbarText}>Photo</Text>
        </TouchableOpacity>
    </View>
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
  starContainer: {
    alignItems: 'flex-start', // Left-align the stars
    marginBottom: 12,
  },
  tagsSection: {
    marginVertical: 12,
  },
  tagInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    fontSize: 16,
    marginRight: 8,
    width: '60%',
  },
  addTagButton: {
    padding: 6,
    backgroundColor: '#EEE',
    borderRadius: 4,
    alignSelf: 'center',
    marginLeft: 4,
  },
  tagsList: {
    marginTop: 8,
  },
  tagItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F2F2F2',
    marginRight: 6,
    borderRadius: 12,
  },
   toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 20,
  },
  toolbarItem: {
    alignItems: 'center',
  },
  toolbarText: {
    fontSize: 14,
    color: '#E05B4E',
  },
});
