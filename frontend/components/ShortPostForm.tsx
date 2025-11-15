import React, {
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
import CreatePostToolBar from './CreatePostToolBar';

export interface ShortPostFormRef {
  submit: () => void;
}

interface ShortPostFormProps {
  showTextBox: boolean;
  showStars: boolean;
  onToolbarAction: (action: string) => void; // Expect this as a prop
  onSubmit: (data: { content: string; rating?: number }) => void;
}

const ShortPostForm = forwardRef<ShortPostFormRef, ShortPostFormProps>(
({ showTextBox, showStars, onToolbarAction, onSubmit }, ref) => {
  const [content, setContent] = React.useState('');
  const [rating, setRating] = React.useState<number>(0);

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
      <CreatePostToolBar onToolbarAction={onToolbarAction}/>
    </View>
  );
});

export default ShortPostForm;

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
