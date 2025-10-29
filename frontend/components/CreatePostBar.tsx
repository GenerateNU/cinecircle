import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/CreatePostBar.styles";

interface CreatePostBarProps {
  onBack: () => void;
}

export default function CreatePostBar({ onBack }: CreatePostBarProps) {
  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={onBack}>
        <MaterialIcons name="arrow-back-ios" style={styles.backButton} />
      </TouchableOpacity>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create</Text>
      </View>

    </View>
  );
}