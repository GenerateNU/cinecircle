import React, {
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import StarRating from './StarRating';
import CreatePostToolBar from './CreatePostToolBar'

export interface ShortPostFormRef {
  submit: () => void;
}

interface ShortPostFormProps {
  showTextBox: boolean;
  showStars: boolean;
  onSubmit: (data: { content: string; rating?: number }) => void;
}

const PostForm = forwardRef<ShortPostFormRef, ShortPostFormProps>(
({ showTextBox, showStars, onSubmit }, ref) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(0);

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

      {showStars && (
        <View style={styles.starContainer}>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
          />
        </View>
      )}

      {showTextBox && (
        <TextInput
          style={styles.textBox}
          multiline
          placeholder="Start sharing your thoughts..."
          placeholderTextColor="#A3A3A3"
          value={content}
          onChangeText={setContent}
          maxLength={280} 
        />
      )}

      <Text style={styles.charCount}>{content.length}/280</Text>
      <CreatePostToolBar/>
    </View>
  );
});

export default PostForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  starContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  textBox: {
    minHeight: 140,
    fontSize: 16,
    textAlignVertical: 'top',
    paddingTop: 8,
    color: '#000',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    color: '#A3A3A3',
  },
});
