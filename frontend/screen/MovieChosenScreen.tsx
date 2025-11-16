import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RatingRow from '../components/RatingRow';
import TagList from '../components/TagList';
import ActionButtons from '../components/ActionButtons';
import ReviewCard from '../components/ReviewCard';
import FilterBar from '../components/FilterBar';
import { translateTextApi } from '../services/translationService';

// keep the original English description as a constant
const ORIGINAL_DESCRIPTION =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,';

export default function MovieChosenScreen() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

  const [translatedDescription, setTranslatedDescription] = useState<
    string | null
  >(null);
  const [isTranslatingDescription, setIsTranslatingDescription] =
    useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const handleTranslateDescription = async () => {
    const description = ORIGINAL_DESCRIPTION;
    if (!description) return;

    try {
      setIsTranslatingDescription(true);
      setTranslateError(null);

      // Hard-code: translate FROM English TO Hindi
      const resp = await translateTextApi(description, 'hi', 'en');
      console.log('[translate] response:', resp);

      setTranslatedDescription(resp.destinationText);
    } catch (err: any) {
      console.error('[translate] error translating description:', err?.message);
      setTranslateError('Failed to translate description');
    } finally {
      setIsTranslatingDescription(false);
    }
  };

  // pick which description to show
  const descriptionToShow = translatedDescription ?? ORIGINAL_DESCRIPTION;

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <SearchBar />

      {/* Movie Title */}
      <Text style={styles.title}>Movie Title</Text>

      {/* Metadata */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>2025 • Directed by: Emily Chooi</Text>
        <Text style={styles.genreText}>
          Genre • Genre • Genre • Genre • Genre
        </Text>
      </View>

      {/* Description + Translate button */}
      <View>
        <Text style={styles.description} numberOfLines={3}>
          {descriptionToShow}
        </Text>

        <View style={styles.translateRow}>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={handleTranslateDescription}
            disabled={isTranslatingDescription}
          >
            <Text style={styles.translateButtonText}>
              {isTranslatingDescription
                ? 'Translating...'
                : 'Translate to Hindi'}
            </Text>
          </TouchableOpacity>
        </View>

        {translateError && (
          <Text style={styles.translateErrorText}>{translateError}</Text>
        )}
      </View>

      {/* Tags */}
      <TagList tags={['Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1']} />

      {/* Ratings */}
      <View style={styles.ratingsContainer}>
        <RatingRow label="Overall" rating={0} />
        <RatingRow label="Rotten Tomatoes" rating={0} />
        <RatingRow label="IBM" rating={0} />
      </View>

      {/* Action Buttons */}
      <ActionButtons />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'reviews' && styles.activeTabText,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'comments' && styles.activeTabText,
            ]}
          >
            Comments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar*/}
      <FilterBar />

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'reviews' ? (
          <>
            <ReviewCard />
            <ReviewCard />
          </>
        ) : (
          <Text style={styles.placeholderText}>Comments coming soon...</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  metaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  genreText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#333',
  },
  translateRow: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  translateButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#000',
  },
  translateButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  translateErrorText: {
    paddingHorizontal: 16,
    marginTop: 4,
    fontSize: 12,
    color: '#FF3B30',
  },
  ratingsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
