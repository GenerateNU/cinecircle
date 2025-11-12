import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native'; // Optional icon library

interface Props {
  value: 'long' | 'short' | 'rating' | null;
  onChange: (value: 'long' | 'short' | 'rating') => void;
}

const PostTypeSelector: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { key: 'short', label: 'Short Post', desc: 'Quick thoughts or updates' },
    { key: 'long', label: 'Long Post', desc: 'Share a detailed story' },
    { key: 'rating', label: 'Rating', desc: 'Give feedback with a score' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Create a new post</Text>
      <Text style={styles.subtitle}>Choose what kind of post you want to make:</Text>
      <View style={styles.optionContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.option,
              value === opt.key && styles.optionSelected,
            ]}
            activeOpacity={0.8}
            onPress={() => onChange(opt.key as 'long' | 'short' | 'rating')}
          >
            <Text style={styles.optionLabel}>{opt.label}</Text>
            <Text style={styles.optionDesc}>{opt.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1C1C1E',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6C757D',
    marginBottom: 16,
  },
  optionContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  optionDesc: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 2,
  },
});

export default PostTypeSelector;
