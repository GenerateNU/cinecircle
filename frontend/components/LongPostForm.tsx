import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import StarRating from "./StarRating";
import CreatePostToolBar from "./CreatePostToolBar";

export interface LongPostFormRef {
  submit: () => void;
}

interface Props {
  showTextBox: boolean;
  showStars: boolean;
  selectedMovie: { movieId: string; title: string } | null;
  selectedTags: string[];
  onSelectMovie: () => void;
  onSelectTags: () => void;
  onSubmit: (data: any) => void;
  onToolbarAction: (action: string) => void;
}

const LongPostForm = forwardRef<LongPostFormRef, Props>(
(
  { showTextBox, showStars, selectedMovie, onSelectMovie, onSelectTags, onSubmit, onToolbarAction },
  ref
) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      {/* STARS */}
      {showStars && (
        <View style={styles.starContainer}>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>
      )}

      {/* MOVIE SELECT DISPLAY */}
      <TouchableOpacity onPress={onSelectMovie} style={styles.selectorBtn}>
        <Text style={styles.selectorText}>
          {selectedMovie ? selectedMovie.title : "Select Movie"}
        </Text>
      </TouchableOpacity>

      {/* TITLE */}
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#A3A3A3"
        value={title}
        onChangeText={setTitle}
      />

      {/* SUBTITLE */}
      <TextInput
        style={styles.subtitleInput}
        placeholder="Subtitle (optional)"
        placeholderTextColor="#A3A3A3"
        value={subtitle}
        onChangeText={setSubtitle}
      />

      {/* CONTENT */}
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

      {/* TAGS SECTION */}
      <TouchableOpacity onPress={onSelectTags} style={styles.selectorBtn}>
        <Text style={styles.selectorText}>Add Tags</Text>
      </TouchableOpacity>

      <View style={styles.tagRow}>
        {selectedTags.map((t) => (
          <View key={t} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{t}</Text>
          </View>
        ))}
      </View>

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
  selectorBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E66A4E",
    marginBottom: 12,
  },
  selectorText: {
    fontFamily: "Figtree_500Medium",
    color: "#E66A4E",
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
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    backgroundColor: "#D5ECEF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipText: {
    fontFamily: "Figtree_500Medium",
  },
});
