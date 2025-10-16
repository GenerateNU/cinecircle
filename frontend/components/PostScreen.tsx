import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

export default function PostScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Post title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Write something..."
        value={content}
        onChangeText={setContent}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  back: { fontSize: 18, marginBottom: 10, color: '#007AFF' },
  input: { fontSize: 20, marginBottom: 12, borderBottomWidth: 1 },
  textArea: { fontSize: 16, flex: 1, textAlignVertical: 'top' },
});
