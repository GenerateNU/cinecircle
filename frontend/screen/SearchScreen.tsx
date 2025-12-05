import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SearchToggle from '../components/SearchToggle';
import SearchBar from '../components/SearchBar';
import { searchUsers } from '../services/searchService';

const { width, height } = Dimensions.get('window');

type SearchCategory = 'movies' | 'posts' | 'events' | 'users';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    origin?: string;
    defaultCategory?: SearchCategory;
  }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(
    (params.defaultCategory as SearchCategory) || 'movies'
  );
  const [statusMessage, setStatusMessage] = useState<string>('');

  const searchCategories = [
    { value: 'movies' as SearchCategory, label: 'Movies' },
    { value: 'posts' as SearchCategory, label: 'Posts' },
    { value: 'events' as SearchCategory, label: 'Events' },
    { value: 'users' as SearchCategory, label: 'Users' },
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  };

  useEffect(() => {
    setStatusMessage('');
  }, [selectedCategory, searchQuery]);

  const handleSearch = async () => {
  const query = searchQuery.trim();
  if (!query) return;

  // Navigate to results page for ALL categories
  router.push({
    pathname: '/search/results',
    params: {
      query,
      category: selectedCategory,
      origin: params.origin,
    },
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarWrapper}>
          <SearchBar
            placeholder={`Search ${selectedCategory}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            editable={true}
            onSubmitEditing={handleSearch}
          />
        </View>

        {/* Search Category Toggle */}
        <View style={styles.toggleContainer}>
          <SearchToggle
            options={searchCategories}
            activeOption={selectedCategory}
            onOptionChange={setSelectedCategory}
          />
        </View>

        {/* Empty state */}
        <View style={styles.emptyState}>
          <Ionicons name="search" size={width * 0.16} color="#DDD" />
          <Text style={styles.emptyText}>
            {searchQuery.trim()
              ? 'Press enter to search'
              : `Search for ${selectedCategory}`}
          </Text>
          {!!statusMessage && (
            <Text style={styles.statusText}>{statusMessage}</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  keyboardView: {
    flex: 1,
  },
  backButtonContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.01,
  },
  backButton: {
    padding: width * 0.01,
    alignSelf: 'flex-start',
  },
  searchBarWrapper: {
    // No extra styling - SearchBar has its own container padding
  },
  toggleContainer: {
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: height * 0.1,
  },
  emptyText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
  },
  statusText: {
    marginTop: 8,
    color: '#d62e05',
    textAlign: 'center',
    paddingHorizontal: width * 0.1,
  },
});
