import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/CreatePostBar.styles";

interface CreatePostBarProps {
  onBack: () => void;
  onNext?: () => void;
}

export default function CreatePostBar({ onBack, onNext }: CreatePostBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back-ios" size={25} color="#9A0169" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Create</Text>
      
      <TouchableOpacity 
        onPress={onNext} 
        style={[styles.nextButton, !onNext && styles.disabled]}
        disabled={!onNext}
      >
        <Text style={[styles.nextText, !onNext && styles.disabledText]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}