import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import StarRating from './StarRating';
import CreatePostToolBar from './CreatePostToolBar';

export interface LongPostFormRef {
  submit: () => void;
}

interface LongPostFormProps {
  showTextBox: boolean;
  showStars: boolean;
  onToolbarAction: (action: string) => void; // <-- Added here
  onSubmit: (data: { content: string; rating?: number; title?: string; subtitle?: string; tags?: string[] }) => void;
}

const LongPostForm = forwardRef<LongPostFormRef, LongPostFormProps>(
  ({ showTextBox, showStars, onToolbarAction, onSubmit }, ref) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [showTagInput, setShowTagInput] = useState(false);

    useImperativeHandle(ref, () => ({
      submit() {
        onSubmit({
          content,
          rating: rating || undefined,
          title,
          subtitle,
          tags
        });
      }
    }));

    const addTag = () => {
      const cleaned = tagInput.trim();
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
      }
      setTagInput('');
      setShowTagInput(false);
    };

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          placeholder="Add a title..."
          placeholderTextColor="#C4C4C4"
          value={title}
          onChangeText={setTitle}
        />

        {showStars && (
          <View style={styles.starContainer}>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
            />
          </View>
        )}

        <TextInput
          style={styles.subtitle}
          placeholder="Add a subtitle..."
          placeholderTextColor="#C4C4C4"
          value={subtitle}
          onChangeText={setSubtitle}
        />

        {showTextBox && (
          <TextInput
            style={styles.body}
            multiline
            placeholder="Start sharing your thoughts..."
            placeholderTextColor="#C4C4C4"
            value={content}
            onChangeText={setContent}
          />
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {tags.map((tag, idx) => (
            <View key={idx} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.tagAddPill}
            onPress={() => setShowTagInput(true)}
          >
            <Text style={styles.addTagText}>+ Tag</Text>
          </TouchableOpacity>
        </ScrollView>

        {showTagInput && (
          <TextInput
            style={styles.tagInput}
            placeholder="Enter tag..."
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={addTag}
            returnKeyType="done"
            autoFocus
            onBlur={() => setShowTagInput(false)}
          />
        )}

        {/* Pass the handler from props, not a local function */}
        <CreatePostToolBar onToolbarAction={onToolbarAction}/>
      </View>
    );
  }
);


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
    marginBottom: 8,
  },
  starContainer: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tagsContainer: {
    minHeight: 48,
    flexDirection: 'row',
    marginVertical: 12,
    flexWrap: 'nowrap',
  },
  tagPill: {
    backgroundColor: '#E5F2F7',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 15,
    color: '#458EA6',
  },
  tagAddPill: {
    borderWidth: 1,
    borderColor: '#458EA6',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  addTagText: {
    fontSize: 15,
    color: '#458EA6',
  },
  tagInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    fontSize: 16,
    marginVertical: 4,
    width: '70%',
    alignSelf: 'flex-start',
  },
});
