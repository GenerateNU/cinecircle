import React, { useState } from 'react';
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

  const searchCategories = [
    { value: 'movies' as SearchCategory, label: 'Movies' },
    { value: 'posts' as SearchCategory, label: 'Posts' },
    { value: 'events' as SearchCategory, label: 'Events' },
    { value: 'users' as SearchCategory, label: 'Users' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search/results',
        params: {
          query: searchQuery,
          category: selectedCategory,
          origin: params.origin,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={width * 0.06} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons 
              name="search" 
              size={width * 0.05} 
              color="#999" 
              style={styles.searchIcon} 
            />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${selectedCategory}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={width * 0.05} color="#999" />
              </TouchableOpacity>
            )}
          </View>
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
              ? 'Press search to find results'
              : `Search for ${selectedCategory}`}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: width * 0.01,
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  placeholder: {
    width: width * 0.08,
  },
  searchContainer: {
    padding: width * 0.04,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#000',
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
});