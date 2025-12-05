import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";

import MovieSelectorModal from "./MovieSelectorModal";
import StarRating from "./StarRating";
import CreatePostToolBar from "./CreatePostToolBar";
import TagModal from './TagSelectorModal'

interface LongPostFormProps {
  onSubmit: (data: any) => void;
  onToolbarAction: (action: string) => void;
}

interface Movie {
  id: string;
  title?: string | null;
}

const LongPostForm = forwardRef(({ onSubmit, onToolbarAction }: LongPostFormProps, ref) => {
  const [movie, setMovie] = useState<Movie | null>(null);
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

      <View style={styles.spoilerRow}>
        <Text style={styles.spoilerLabel}>Spoiler</Text>
        <Switch
          value={spoiler}
          onValueChange={setSpoiler}
          trackColor={{ true: "#e8856d", false: "#e8856d" }}
          thumbColor='white'
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
          <View key={t} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{t}</Text>
          </View>
        ))}
      </View>

       <CreatePostToolBar onToolbarAction={onToolbarAction} />

      <MovieSelectorModal
        visible={movieModalVisible}
        onClose={() => setMovieModalVisible(false)}
        onSelect={(selectedMovie) => {
          setMovie({
                id: selectedMovie.movieId,
                title: selectedMovie.title,
            });
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

  spoilerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  titleInput: {
     fontSize: 22,
     fontFamily: "Figtree_600SemiBold",
     marginBottom: 12,
     color: "#000",
   },

  spoilerLabel: {
    fontFamily: "Figtree_500Medium",
    fontSize: 14,
    color: "#444",
    marginRight: 10,
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
