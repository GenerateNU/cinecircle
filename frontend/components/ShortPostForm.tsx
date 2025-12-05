import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

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

    const CHAR_LIMIT = 280;

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

        <CreatePostToolBar onToolbarAction={onToolbarAction} />

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
});
