import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from "react-native";
import StarRating from "./StarRating";
import CreatePostToolBar from "./CreatePostToolBar";

export interface LongPostFormRef {
  submit: () => void;
}

interface LongPostFormProps {
  showTextBox: boolean;
  showStars: boolean;
  onToolbarAction: (action: string) => void;
  onSubmit: (data: {
    title: string;
    subtitle?: string;
    content: string;
    rating?: number;
  }) => void;
}

const LongPostForm = forwardRef<LongPostFormRef, LongPostFormProps>(
({ showTextBox, showStars, onToolbarAction, onSubmit }, ref) => {

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(0);

  useImperativeHandle(ref, () => ({
    submit() {
      onSubmit({
        title,
        subtitle: subtitle || undefined,
        content,
        rating: rating || undefined,
      });
    },
  }));

  return (
    <View style={styles.container}>

      {showStars && (
        <View style={styles.starContainer}>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>
      )}

      {/* TITLE INPUT */}
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#A3A3A3"
        value={title}
        onChangeText={setTitle}
      />

      {/* SUBTITLE INPUT */}
      <TextInput
        style={styles.subtitleInput}
        placeholder="Subtitle (optional)"
        placeholderTextColor="#A3A3A3"
        value={subtitle}
        onChangeText={setSubtitle}
      />

      {/* MAIN CONTENT BOX */}
      {showTextBox && (
        <TextInput
          style={styles.contentInput}
          multiline
          placeholder="Write your thoughts..."
          placeholderTextColor="#A3A3A3"
          value={content}
          onChangeText={setContent}
        />
      )}

      <CreatePostToolBar onToolbarAction={onToolbarAction} />
    </View>
  );
});

export default LongPostForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  starContainer: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  subtitleInput: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  contentInput: {
    minHeight: 200,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#000",
    paddingTop: 8,
  },
});
