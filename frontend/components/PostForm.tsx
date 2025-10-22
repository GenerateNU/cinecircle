import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

interface PostFormProps {
  showTitle?: boolean;
  showStars?: boolean;
  showTextBox?: boolean;
  onSubmit: (data: { title: string; content: string; rating: number }) => void;
}

export default function PostForm({ 
  showTitle = false, 
  showStars = false, 
  showTextBox = true,
  onSubmit 
}: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit({ title, content, rating });
  };

  return (
    <View style={{ padding: 20 }}>
      {showTitle && (
        <TextInput 
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ 
            borderWidth: 1, 
            borderColor: '#ddd', 
            padding: 10, 
            marginBottom: 15,
            borderRadius: 8 
          }}
        />
      )}

    {showStars && (
        <View style={{ marginBottom: 15 }}>
          <TextInput 
            placeholder="Rating (0-5)"
            value={rating.toString()}
            onChangeText={(text) => setRating(Number(text))}
            keyboardType="numeric"
            style={{ 
              borderWidth: 1, 
              borderColor: '#ddd', 
              padding: 10,
              borderRadius: 8 
            }}
          />
        </View>
      )}
      
      {showTextBox && (
        <TextInput 
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          style={{ 
            borderWidth: 1, 
            borderColor: '#ddd', 
            padding: 10, 
            marginBottom: 15,
            borderRadius: 8,
            height: 120 
          }}
        />
      )}
      
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}