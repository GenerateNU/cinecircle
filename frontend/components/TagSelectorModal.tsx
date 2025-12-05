import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';

import Tag from './Tag';
import TagList from './TagList';

const PRESET_TAGS = [
  'drama',
  'romance',
  'action',
  'thriller',
  'comedy',
  'crime',
  'horror',
  'mystery',
  'fantasy',
  'family',
  'period-drama',
  'biographical',
  'musical',
  'mass-entertainer',
  'arthouse',
  'experimental',
  'realistic',
  'stylized',
  'dark-tone',
  'emotional',
  'feel-good',
  'social-issues',
  'political',
  'mythology',
  'coming-of-age',
  'sports-drama',
  'war-drama',
  'satire',
  'suspense',
  'high-energy',
  'masala',
  'melodrama',
  'devotional',
  'desi-humor',
  'star-studded',
  'thought-provoking',
  'festival-release',
  'spicy',
  'blockbuster',
  'classical-music',
  'rural-setting',
  'joint-family',
  'cross-border-love',
  'caste-conflict',
  'arranged-marriage',
  'diaspora-narrative',
  'political-satire',
  'village-drama',
  'mytho-fantasy',
  'historical-epic',
];

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
  const [query, setQuery] = useState('');
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      // Fade in backdrop first
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      // Then slide up sheet
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
    ? PRESET_TAGS.filter(t => t.toLowerCase().includes(query.toLowerCase()))
    : [];

  const toggleTag = (tag: string) => {
    let updated = [...selected];

    if (updated.includes(tag)) {
      updated = updated.filter(t => t !== tag);
    } else if (updated.length < 8) {
      updated.push(tag);
    }

    onChangeSelected(updated);
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
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
              keyExtractor={item => item}
              contentContainerStyle={styles.pillContainer}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  backdropTouchable: {
    flex: 1,
  },

  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 18,
    minHeight: '45%',
  },

  dragHandle: {
    width: 45,
    height: 4,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 14,
  },

  label: {
    fontFamily: 'Figtree_600SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    fontFamily: 'Figtree_400Regular',
    marginBottom: 20,
    fontSize: 15,
  },

  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
