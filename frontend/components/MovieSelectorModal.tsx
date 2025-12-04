import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { getAllMovies } from "../services/moviesService";

interface Movie {
  movieId: string;
  title?: string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (movie: Movie) => void;
}

export default function MovieSelectorModal({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (visible) {
      (async () => {
        try {
          const movies = await getAllMovies();
          console.log("Movie API returned:", movies);
          setAllMovies(movies);
        } catch (err) {
          console.log("Error fetching movies:", err);
        }
      })();
    }
  }, [visible]);

  const filtered = query.length
    ? allMovies.filter((m) =>
        m.title?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.label}>Select Movie</Text>

          <TextInput
            style={styles.input}
            placeholder="+ Start typing to select a movie..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.movieId}
            contentContainerStyle={styles.pillContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pill}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.pillText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 18,
    minHeight: "45%",
  },

  dragHandle: {
    width: 45,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 14,
  },

  label: {
    fontFamily: "Figtree_600SemiBold",
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Figtree_400Regular",
    marginBottom: 20,
    fontSize: 15,
  },

  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  pill: {
    backgroundColor: "#e66a4e",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
  },

  pillText: {
    color: "white",
    fontFamily: "Figtree_500Medium",
  },
});
