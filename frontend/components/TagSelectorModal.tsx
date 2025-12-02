import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

import { getAllTags } from "../services/tagsService"; // <-- You will need this service

interface Props {
  visible: boolean;
  selected: string[];
  onChangeSelected: React.Dispatch<React.SetStateAction<string[]>>;
  onClose: () => void;
}

export default function TagSelectorModal({
  visible,
  selected,
  onChangeSelected,
  onClose,
}: Props) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (visible) {
      (async () => {
        try {
          const tags = await getAllTags();
          console.log("Tags API returned:", tags);
          setAllTags(tags);
        } catch (err) {
          console.log("Error fetching tags:", err);
        }
      })();
    }
  }, [visible]);

const toggleTag = (tag: string) => {
  let newTags = [...selected];

  if (newTags.includes(tag)) {
    newTags = newTags.filter(t => t !== tag);
  } else if (newTags.length < 8) {
    newTags.push(tag);
  }

  onChangeSelected(newTags);
};

  const filtered = allTags.filter((t) =>
    t.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Tap outside to close */}
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={onClose}
      />

      <View style={styles.modalContainer}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.label}>Add Tags</Text>

          <TextInput
            style={styles.input}
            placeholder="+ Start typing to search tags..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.pillContainer}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => toggleTag(item)}
                >
                  <Text
                    style={[styles.pillText, isSelected && styles.pillTextSelected]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    gap: 10,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: "#d5ecef",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 10,
  },
  pillSelected: {
    backgroundColor: "#e66a4e",
  },
  pillText: {
    fontFamily: "Figtree_500Medium",
    color: "#333",
  },
  pillTextSelected: {
    color: "white",
  },
});
