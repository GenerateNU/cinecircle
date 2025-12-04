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

import Tag from "./Tag";
import TagList from "./TagList";
//import { getAllTags } from "../services/tagsService";

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

          const names =
            tags && typeof tags[0] === "string"
              ? tags
              : tags.map((t: any) => t.name || t.label || String(t));

          setAllTags(names);
        } catch (err) {
          console.log("Error fetching tags:", err);
        }
      })();
    }
  }, [visible]);

  const toggleTag = (tag: string) => {
    let updated = [...selected];

    if (updated.includes(tag)) {
      updated = updated.filter((t) => t !== tag);
    } else if (updated.length < 8) {
      updated.push(tag);
    }

    onChangeSelected(updated);
  };

  const filtered = allTags.filter((t) =>
    t.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.label}>Add Tags</Text>

          {selected.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <TagList tags={selected} />
            </View>
          )}

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
            contentContainerStyle={styles.tagList}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const isPressed = selected.includes(item);
              return (
                <Tag
                  label={item}
                  pressed={isPressed}
                  onPress={() => toggleTag(item)}
                />
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
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 16,
    minHeight: "45%",
  },
  dragHandle: {
    width: 45,
    height: 4,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 40,
  },
});
