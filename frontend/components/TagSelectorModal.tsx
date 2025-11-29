import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";

interface Props {
  visible: boolean;
  selected: string[];
  onChangeSelected: (tags: string[]) => void;
  onClose: () => void;
}

const PRESET_TAGS = [
  "Funny",
  "Slow",
  "Beautiful",
  "Emotional",
  "Confusing",
  "Smart",
  "Thrilling",
  "Charming",
  "Dark",
  "Goofy",
  "Must Watch",
  "Underrated",
  "Overrated",
];

export default function TagSelectorModal({
  visible,
  selected,
  onChangeSelected,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");

  const toggleTag = (tag: string) => {
    onChangeSelected((prev: string[]) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 8) return prev;
      return [...prev, tag];
    });
  };

  const filteredTags = PRESET_TAGS.filter((t) =>
    t.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.header}>Add Tags</Text>

          <TextInput
            style={styles.input}
            placeholder="+ Start typing to add a tag..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
          />

          <FlatList
            data={filteredTags}
            keyExtractor={(item) => item}
            numColumns={3}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const isSelected = selected.includes(item);
              return (
                <TouchableOpacity
                  style={[
                    styles.tagChip,
                    isSelected && styles.tagChipSelected,
                  ]}
                  onPress={() => toggleTag(item)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected && styles.tagTextSelected,
                    ]}
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
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: "45%",
  },
  dragHandle: {
    width: 45,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontFamily: "Figtree_600SemiBold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    fontFamily: "Figtree_400Regular",
  },
  list: {
    gap: 10,
  },
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#D5ECEF",
  },
  tagChipSelected: {
    backgroundColor: "#E66A4E",
  },
  tagText: {
    fontFamily: "Figtree_500Medium",
    color: "#333",
  },
  tagTextSelected: {
    color: "#fff",
  },
});
