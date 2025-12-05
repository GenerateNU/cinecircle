import React, { useEffect, useState, useRef } from "react";
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
  Animated,
} from "react-native";

import { getAllMovies } from "../services/moviesService";

interface Movie {
  id: string;
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
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      (async () => {
        try {
          const movies = await getAllMovies();
          console.log("Movie API returned:", movies);
          // Transform API response to use consistent 'id' property
          const transformedMovies = movies.map((movie: any) => ({
            id: movie.movieId,
            title: movie.title
          }));
          setAllMovies(transformedMovies);
        } catch (err) {
          console.log("Error fetching movies:", err);
        }
      })();

      // Fade in backdrop first
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      // Then slide up sheet without bounce using easeOut
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset animations
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(400);
    }
  }, [visible]);

  const filtered = query.length
    ? allMovies.filter((m) =>
        m.title?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "position" : undefined}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
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
              keyExtractor={(item) => item.id}
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
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  backdropTouchable: {
    flex: 1,
  },

  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "flex-end",
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
