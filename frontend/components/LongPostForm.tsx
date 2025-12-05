import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import MovieSelectorModal from "./MovieSelectorModal";
import StarRating from "./StarRating";
import CreatePostToolBar from "./CreatePostToolBar";
import TagModal from './TagSelectorModal'
import Tag from './Tag'
import SpoilerButton from './SpoilerButton'

interface LongPostFormProps {
  onSubmit: (data: any) => void;
  onToolbarAction: (action: string) => void;
  preselectedMovie?: { id: string; title: string } | null;
}

interface Movie {
  id: string;
  title?: string | null;
}

const LongPostForm = forwardRef(({ onSubmit, onToolbarAction, preselectedMovie }: LongPostFormProps, ref) => {
  const [movie, setMovie] = useState<Movie | null>(preselectedMovie || null);
  const [spoiler, setSpoiler] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);

  const CHAR_LIMIT = 280;

  useImperativeHandle(ref, () => ({
    submit() {
      if (!movie) {
        alert("Please select a movie.");
        return;
      }
      if (content.trim().length === 0) {
        alert("Please enter content.");
        return;
      }

      onSubmit({
        movieId: movie.id,
        spoiler,
        title,
        content,
        rating,
        tags: selectedTags,
      });
    },
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => {
          setMovieModalVisible(true)
        }}
      >
        <Text style={styles.dropdownText}>
          {movie ? movie.title : "Select Movie"}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 18 }}>
        <SpoilerButton
          isSpoiler={spoiler}
          onToggle={setSpoiler}
        />
      </View>

        <TextInput
        style={styles.titleInput}
         placeholder="Add a title..."
        placeholderTextColor="#B7B7B7"
         value={title}
         onChangeText={setTitle}
       />

        <View style={styles.starContainer}>
          <StarRating rating={rating} onRatingChange={setRating} />
        </View>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Start sharing your thoughts..."
        placeholderTextColor="#aaa"
        value={content}
        onChangeText={(text) => {
          if (text.length <= CHAR_LIMIT) setContent(text);
        }}
      />

      <TouchableOpacity onPress={() => {
          setTagModalVisible(true)
        }} style={styles.dropdown}>
        <Text style={styles.dropdownText}>Add Tags</Text>
      </TouchableOpacity>

      <View style={styles.tagRow}>
        {selectedTags.map((t) => (
          <Tag
            key={t}
            label={t}
            onPress={() => {
              const updated = selectedTags.filter(tag => tag !== t);
              setSelectedTags(updated);
            }}
          />
        ))}
      </View>

       <CreatePostToolBar onToolbarAction={onToolbarAction} />

      <MovieSelectorModal
        visible={movieModalVisible}
        onClose={() => setMovieModalVisible(false)}
        onSelect={(selectedMovie) => {
          setMovie(selectedMovie);
        }}
      />

      <TagModal
        visible={tagModalVisible}
        selected={selectedTags}
        onChangeSelected={setSelectedTags}
        onClose={() => setTagModalVisible(false)}
      />
    </View>
  );
});

export default LongPostForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  dropdown: {
    borderWidth: 1.4,
    borderColor: "#e66a4e",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  dropdownText: {
    fontFamily: "Figtree_500Medium",
    fontSize: 15,
    color: "#e66a4e",
  },

  titleInput: {
     fontSize: 22,
     fontFamily: "Figtree_600SemiBold",
     marginBottom: 12,
     color: "#000",
   },

  input: {
    marginTop: 18,
    minHeight: 160,
    fontFamily: "Figtree_400Regular",
    fontSize: 15,
    color: "#333",
  },

 starContainer: {
     marginBottom: 16,
    alignItems: "flex-start",
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    gap: 8,
    marginTop: 8,
  },
});
