import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

import MovieSelectorModal from './MovieSelectorModal';
import CreatePostToolBar from './CreatePostToolBar';
import SpoilerButton from './SpoilerButton';
import type { components } from '../types/api-generated';

type ShortPostFormData = components['schemas']['ShortPostFormData'];

interface ShortPostFormProps {
  onSubmit: (data: ShortPostFormData) => void;
  onToolbarAction: (action: string) => void;
  preselectedMovie?: { id: string; title: string } | null;
}

interface Movie {
  id: string;
  title?: string | null;
}

const ShortPostForm = forwardRef(
  (
    { onSubmit, onToolbarAction, preselectedMovie }: ShortPostFormProps,
    ref
  ) => {
    const [movie, setMovie] = useState<Movie | null>(preselectedMovie || null);
    const [spoiler, setSpoiler] = useState(false);
    const [content, setContent] = useState('');
    const [movieModalVisible, setMovieModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const CHAR_LIMIT = 280;

    const requestPermissions = async () => {
      const { status } =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Enable permissions to upload a photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    };

    const pickImage = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      try {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets) {
          const newImageUris = result.assets.map(asset => asset.uri);
          setSelectedImages(prev => [...prev, ...newImageUris]);
        }
      } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image.');
      }
    };

    const removeImage = (indexToRemove: number) => {
      setSelectedImages(prev =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    };

    const handleToolbarAction = (action: string) => {
      if (action === 'video') {
        pickImage();
      } else {
        onToolbarAction(action);
      }
    };

    useImperativeHandle(ref, () => ({
      submit() {
        if (!movie) {
          alert('Please select a movie.');
          return;
        }
        if (content.trim().length === 0) {
          alert('Please enter content.');
          return;
        }

        onSubmit({
          movieId: movie.id,
          spoiler,
          content,
          imageUrls: selectedImages.length > 0 ? selectedImages : undefined,
        });
      },
    }));

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => {
            setMovieModalVisible(true);
          }}
        >
          <Text style={styles.dropdownText}>
            {movie ? movie.title : 'Select Movie'}
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 18 }}>
          <SpoilerButton isSpoiler={spoiler} onToggle={setSpoiler} />
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Start sharing your thoughts..."
          placeholderTextColor="#aaa"
          value={content}
          onChangeText={text => {
            if (text.length <= CHAR_LIMIT) setContent(text);
          }}
        />

        <Text style={styles.charCount}>
          {content.length}/{CHAR_LIMIT}
        </Text>

        {selectedImages.length > 0 && (
          <ScrollView
            horizontal
            style={styles.imagePreviewContainer}
            showsHorizontalScrollIndicator={false}
          >
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imagePreviewWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <CreatePostToolBar onToolbarAction={handleToolbarAction} />

        <MovieSelectorModal
          visible={movieModalVisible}
          onClose={() => setMovieModalVisible(false)}
          onSelect={selectedMovie => {
            setMovie(selectedMovie);
          }}
        />
      </View>
    );
  }
);

export default ShortPostForm;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  dropdown: {
    borderWidth: 1.4,
    borderColor: '#e66a4e',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  dropdownText: {
    fontFamily: 'Figtree_500Medium',
    fontSize: 15,
    color: '#e66a4e',
  },

  input: {
    marginTop: 18,
    minHeight: 160,
    fontFamily: 'Figtree_400Regular',
    fontSize: 15,
    color: '#333',
  },

  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Figtree_400Regular',
    color: '#aaa',
    fontSize: 12,
  },

  imagePreviewContainer: {
    marginTop: 12,
    marginBottom: 8,
  },

  imagePreviewWrapper: {
    position: 'relative',
    marginRight: 8,
  },

  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },

  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
