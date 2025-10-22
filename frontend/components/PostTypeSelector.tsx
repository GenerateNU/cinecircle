import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from "../styles/PostTypeSelector.styles";


type PostType = 'short' | 'long' | 'rating';

interface PostTypeSelectorProps {
  value: PostType;
  onChange: (type: PostType) => void;
}

export default function PostTypeSelector({
  value,
  onChange,
}: PostTypeSelectorProps) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}> Select </Text>
        {(['short', 'long', 'rating'] as PostType[]).map(type => (
            <TouchableOpacity
            key={type}
            style={[styles.button, value === type && styles.selected]}
            onPress={() => onChange(type)}
         >
           <Text
              style={[
                styles.text,
                value === type && styles.selectedText,
               ]}
           >
                {type.toUpperCase()}
           </Text>
          </TouchableOpacity>
      ))}
    </View>
  );
}
