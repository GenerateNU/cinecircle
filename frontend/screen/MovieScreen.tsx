import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import MovieChosenScreen from './MovieChosenScreen';
interface Movie {
  id: number;
  title: string;
  badge?: 'New!' | 'Hot!';
  image: string;
}
const MOCK_MOVIES: Movie[] = [
  { id: 1, title: 'Inception', badge: 'New!', image: 'https://via.placeholder.com/150x220/667eea/ffffff?text=Movie+1' },
  { id: 2, title: 'The Matrix', badge: 'Hot!', image: 'https://via.placeholder.com/150x220/f093fb/ffffff?text=Movie+2' },
  { id: 3, title: 'Interstellar', image: 'https://via.placeholder.com/150x220/4facfe/ffffff?text=Movie+3' },
  { id: 4, title: 'The Dark Knight', badge: 'New!', image: 'https://via.placeholder.com/150x220/00f2fe/ffffff?text=Movie+4' },
  { id: 5, title: 'Pulp Fiction', image: 'https://via.placeholder.com/150x220/43e97b/ffffff?text=Movie+5' },
  { id: 6, title: 'Fight Club', image: 'https://via.placeholder.com/150x220/fa709a/ffffff?text=Movie+6' },
  { id: 7, title: 'Forrest Gump', badge: 'New!', image: 'https://via.placeholder.com/150x220/fee140/ffffff?text=Movie+7' },
  { id: 8, title: 'The Godfather', image: 'https://via.placeholder.com/150x220/30cfd0/ffffff?text=Movie+8' },
  { id: 9, title: 'Goodfellas', image: 'https://via.placeholder.com/150x220/a8edea/ffffff?text=Movie+9' },
];
export default function MoviesScreen() {
  const [activeTab, setActiveTab] = useState<'forYou' | 'recommended'>('forYou');
  const [searchText, setSearchText] = useState<string>('');
  const [showMovieDetail, setShowMovieDetail] = useState<boolean>(false);
  const handleMoviePress = (movieId: number): void => {
    setShowMovieDetail(true);
  };
  const renderMovieCard = (movie: Movie): React.ReactElement => {
    return (
      <TouchableOpacity
        key={movie.id}
        style={styles.movieCard}
        onPress={() => handleMoviePress(movie.id)}
      >
        <Image source={{ uri: movie.image }} style={styles.movieImage} />
        {movie.badge && (
          <View style={[
            styles.badge,
            movie.badge === 'New!' ? styles.badgeNew : styles.badgeHot
          ]}>
            <Text style={styles.badgeText}>{movie.badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const renderSection = (title: string, movies: Movie[]): React.ReactElement => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moviesList}
        >
          {movies.map(renderMovieCard)}
        </ScrollView>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.screen}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter search text"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>:mag:</Text>
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('forYou')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'forYou' && styles.tabTextActive
          ]}>
            For You
          </Text>
          {activeTab === 'forYou' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('recommended')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'recommended' && styles.tabTextActive
          ]}>
            Recommended by friends
          </Text>
          {activeTab === 'recommended' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSection('New Releases', MOCK_MOVIES.slice(0, 4))}
        {renderSection('Genre', MOCK_MOVIES.slice(4, 7))}
        {renderSection('Genre', MOCK_MOVIES.slice(6, 9))}
      </ScrollView>
      {/* Bottom Navigation */}
      <BottomNavBar />
      {/* Movie Detail Modal */}
      <Modal
        visible={showMovieDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMovieDetail(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMovieDetail(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <MovieChosenScreen />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 32,
  },
  tab: {
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  moviesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  movieCard: {
    width: 150,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
  },
  badgeNew: {
    backgroundColor: '#fff',
    borderColor: '#E91E63',
  },
  badgeHot: {
    backgroundColor: '#fff',
    borderColor: '#000',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  modalHeader: {
    padding: 16,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  closeText: {
    fontSize: 24,
    color: '#000',
  },
});
