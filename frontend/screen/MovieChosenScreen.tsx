// frontend/app/screens/MovieChosenScreen.tsx
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RatingRow from '../components/RatingRow';
import TagList from '../components/TagList';
import ActionButtons from '../components/ActionButtons';
import ReviewCard from '../components/ReviewCard';
import FilterBar from '../components/FilterBar';

import {
  fetchAndSaveByTmdbId,
  getMovieRatings,
  getMovieComments,
} from '../services/moviesService';
import { translateTextApi } from '../services/translationService';

import type { Movie as ApiMovie, Rating, Comment } from '../types/models';
import type { components } from '../types/api-generated';

// Match backend envelope type
type GetMovieEnvelope = components['schemas']['GetMovieEnvelope'];

type MovieChosenScreenProps = {
  movieId: string;
};

// 🔹 Shared type for per-item translation state
type ItemTranslationState = {
  isHindi: boolean;
  loading: boolean;
  translatedText?: string | null;
  error?: string | null;
};

export default function MovieChosenScreen({ movieId }: MovieChosenScreenProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

  // Movie metadata from backend
  const [movie, setMovie] = useState<ApiMovie | null>(null);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movieError, setMovieError] = useState<string | null>(null);

  // Ratings + comments from backend
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [listsError, setListsError] = useState<string | null>(null);

  // Description translation state
  const [translatedDescription, setTranslatedDescription] =
    useState<string | null>(null);
  const [isTranslatingDescription, setIsTranslatingDescription] =
    useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [isShowingHindi, setIsShowingHindi] = useState(false);

  // 🔹 Per-review + per-comment translation maps
  const [ratingTranslations, setRatingTranslations] = useState<
    Record<string, ItemTranslationState>
  >({});
  const [commentTranslations, setCommentTranslations] = useState<
    Record<string, ItemTranslationState>
  >({});

  // --- Fetch movie + ratings + comments when movieId changes ---
  useEffect(() => {
    const fetchAll = async () => {
      try {
        console.log('[MovieChosen] fetchAll start', { movieId });
        setMovieLoading(true);
        setMovieError(null);
        setListsError(null);

        // reset translation state on movie change
        setTranslatedDescription(null);
        setIsShowingHindi(false);
        setTranslateError(null);
        setRatingTranslations({});
        setCommentTranslations({});

        const [movieEnv, ratingsRes, commentsRes] = await Promise.all([
          fetchAndSaveByTmdbId(movieId),
          getMovieRatings(movieId),
          getMovieComments(movieId),
        ]);

        console.log(
          '[MovieChosen] movie envelope:',
          JSON.stringify(movieEnv, null, 2),
        );
        console.log(
          '[MovieChosen] ratings response:',
          JSON.stringify(ratingsRes, null, 2),
        );
        console.log(
          '[MovieChosen] comments response:',
          JSON.stringify(commentsRes, null, 2),
        );

        if (!movieEnv || !movieEnv.data) {
          setMovie(null);
          setMovieError('Movie not found');
        } else {
          setMovie(movieEnv.data as ApiMovie);
        }

        setRatings(ratingsRes?.ratings || []);
        setComments(commentsRes?.comments || []);
        console.log('[MovieChosen] lengths:', {
          ratings: ratingsRes?.ratings?.length || 0,
          comments: commentsRes?.comments?.length || 0,
        });
      } catch (err: any) {
        console.error(
          '[MovieChosen] error fetching data:',
          err?.message || err,
        );
        setMovieError('Failed to load movie');
        setListsError('Failed to load reviews/comments');
      } finally {
        setMovieLoading(false);
        console.log('[MovieChosen] fetchAll end');
      }
    };

    if (movieId) {
      fetchAll();
    }
  }, [movieId]);

  const description = movie?.description ?? '';

  // --- Toggle: English ↔ Hindi for description ---
  const handleTranslateDescription = async () => {
    if (!description) return;

    // If currently showing Hindi, go back to English (no API call)
    if (isShowingHindi) {
      console.log('[translate] toggling description back to English');
      setTranslatedDescription(null);
      setIsShowingHindi(false);
      setTranslateError(null);
      return;
    }

    // Otherwise: English → Hindi via API
    try {
      setIsTranslatingDescription(true);
      setTranslateError(null);

      console.log('[translate] description -> hi', {
        movieId,
        descriptionSnippet: description.slice(0, 40),
      });

      const resp = await translateTextApi(description, 'hi', 'en');
      console.log('[translate] response:', resp);

      setTranslatedDescription(resp.destinationText);
      setIsShowingHindi(true);
    } catch (err: any) {
      console.error(
        '[translate] error translating description:',
        err?.message || err,
      );
      setTranslateError('Failed to translate description');
    } finally {
      setIsTranslatingDescription(false);
    }
  };

  const descriptionToShow = translatedDescription ?? description;

  const translateButtonLabel = isShowingHindi
    ? 'Show English'
    : isTranslatingDescription
    ? 'Translating...'
    : 'Translate to Hindi';

  // --- 🔹 Toggle translation for a single review (Rating) ---
  const handleToggleRatingTranslation = async (rating: Rating) => {
  const id = rating.id;
  const originalText =
    (rating as any).comment ?? (rating as any).text ?? '';

  if (!originalText) {
    console.log('[translate] no comment text on rating', { id });
    return;
  }

  const current = ratingTranslations[id];

  // If we're currently loading, do nothing
  if (current?.loading) return;

  // If it's already Hindi → flip back to English (no API call)
  if (current?.isHindi) {
    setRatingTranslations((prev) => ({
      ...prev,
      [id]: { ...current, isHindi: false, error: null },
    }));
    return;
  }

  // If we already have a cached translation → just show it
  if (current?.translatedText) {
    setRatingTranslations((prev) => ({
      ...prev,
      [id]: { ...current, isHindi: true, error: null },
    }));
    return;
  }

  // Otherwise: need to translate EN → HI
  setRatingTranslations((prev) => ({
    ...prev,
    [id]: {
      isHindi: false,
      loading: true,
      translatedText: null,
      error: null,
    },
  }));

  try {
    console.log('[translate] rating -> hi', {
      id,
      textSnippet: originalText.slice(0, 40),
    });

    const resp = await translateTextApi(originalText, 'hi', 'en');

    setRatingTranslations((prev) => ({
      ...prev,
      [id]: {
        isHindi: true,
        loading: false,
        translatedText: resp.destinationText,
        error: null,
      },
    }));
  } catch (err: any) {
    console.error(
      '[translate] error translating rating:',
      err?.message || err,
    );
    setRatingTranslations((prev) => ({
      ...prev,
      [id]: {
        isHindi: false,
        loading: false,
        translatedText: current?.translatedText ?? null,
        error: 'Failed to translate review',
      },
    }));
  }
};
  // --- 🔹 Toggle translation for a single comment ---
  const handleToggleCommentTranslation = async (comment: Comment) => {
  const id = comment.id;
  const originalText =
    (comment as any).text ?? (comment as any).content ?? '';

  if (!originalText) {
    console.log('[translate] no text on comment', { id });
    return;
  }

  const current = commentTranslations[id];

  if (current?.loading) return;

  // Already Hindi → back to English
  if (current?.isHindi) {
    setCommentTranslations((prev) => ({
      ...prev,
      [id]: { ...current, isHindi: false, error: null },
    }));
    return;
  }

  // Cached translation → show Hindi
  if (current?.translatedText) {
    setCommentTranslations((prev) => ({
      ...prev,
      [id]: { ...current, isHindi: true, error: null },
    }));
    return;
  }

  // Need to call API
  setCommentTranslations((prev) => ({
    ...prev,
    [id]: {
      isHindi: false,
      loading: true,
      translatedText: null,
      error: null,
    },
  }));

  try {
    console.log('[translate] comment -> hi', {
      id,
      textSnippet: originalText.slice(0, 40),
    });

    const resp = await translateTextApi(originalText, 'hi', 'en');

    setCommentTranslations((prev) => ({
      ...prev,
      [id]: {
        isHindi: true,
        loading: false,
        translatedText: resp.destinationText,
        error: null,
      },
    }));
  } catch (err: any) {
    console.error(
      '[translate] error translating comment:',
      err?.message || err,
    );
    setCommentTranslations((prev) => ({
      ...prev,
      [id]: {
        isHindi: false,
        loading: false,
        translatedText: current?.translatedText ?? null,
        error: 'Failed to translate comment',
      },
    }));
  }
};

  console.log('[MovieChosen render]', {
    movieId,
    movieTitle: movie?.title,
    ratingsCount: ratings.length,
    commentsCount: comments.length,
  });

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <SearchBar />

      {/* Movie Title */}
      <Text style={styles.title}>{movie?.title ?? 'Movie Title'}</Text>

      {/* Metadata */}
      <View style={styles.metaContainer}>
        {/* Hard-coded for now; wire real year/director later */}
        <Text style={styles.metaText}>2010 • Directed by: Christopher Nolan</Text>
        <Text style={styles.genreText}>Genre • Genre • Genre • Genre • Genre</Text>
      </View>

      {/* Description + Translate toggle */}
      <View>
        {movieLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.loadingText}>Loading movie...</Text>
          </View>
        ) : movieError ? (
          <Text style={styles.errorText}>{movieError}</Text>
        ) : (
          <>
            <Text style={styles.description} numberOfLines={3}>
              {descriptionToShow || 'No description available.'}
            </Text>

            <View style={styles.translateRow}>
              <TouchableOpacity
                style={styles.translateButton}
                onPress={handleTranslateDescription}
                disabled={isTranslatingDescription || !description}
              >
                <Text style={styles.translateButtonText}>
                  {translateButtonLabel}
                </Text>
              </TouchableOpacity>
            </View>

            {translateError && (
              <Text style={styles.translateErrorText}>{translateError}</Text>
            )}
          </>
        )}
      </View>

      {/* Tags (placeholder for now) */}
      <TagList tags={['Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1']} />

      {/* Ratings (real count, placeholder display) */}
      <View style={styles.ratingsContainer}>
        <RatingRow label="Overall" rating={0} />
        <Text style={styles.ratingsMeta}>
          Based on {ratings.length} rating{ratings.length === 1 ? '' : 's'}
        </Text>
        <RatingRow label="Rotten Tomatoes" rating={0} />
        <RatingRow label="IMDB" rating={0} />
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

      {/* Filter Bar */}
      <FilterBar />

      {/* Content */}
      <View style={styles.contentContainer}>
        {listsError && <Text style={styles.errorText}>{listsError}</Text>}

        {activeTab === 'reviews' ? (
          ratings.length > 0 ? (
            ratings.map((r) => {
              const state = ratingTranslations[r.id] || {
                isHindi: false,
                loading: false,
                translatedText: null,
                error: null,
              };

              const originalText =
                (r as any).comment ?? (r as any).text ?? '';
              const textToShow =
                state.isHindi && state.translatedText
                  ? state.translatedText
                  : originalText;

              const buttonLabel = state.isHindi
                ? 'Show English'
                : state.loading
                ? 'Translating...'
                : 'Translate to Hindi';

              return (
                <View key={r.id} style={styles.reviewBlock}>
                  {/* Your existing review card layout */}
                  <ReviewCard
                    // later: pass props like rating={r}
                  />
                  {originalText ? (
                    <View style={styles.itemTranslateContainer}>
                      <Text style={styles.itemText}>{textToShow}</Text>
                      <TouchableOpacity
                        style={styles.itemTranslateButton}
                        onPress={() => handleToggleRatingTranslation(r)}
                        disabled={state.loading}
                      >
                        <Text style={styles.itemTranslateButtonText}>
                          {buttonLabel}
                        </Text>
                      </TouchableOpacity>
                      {state.error && (
                        <Text style={styles.translateErrorText}>
                          {state.error}
                        </Text>
                      )}
                    </View>
                  ) : null}
                </View>
              );
            })
          ) : (
            <Text style={styles.placeholderText}>
              No reviews yet. Be the first to review!
            </Text>
          )
        ) : comments.length > 0 ? (
          comments.map((c) => {
            const state = commentTranslations[c.id] || {
              isHindi: false,
              loading: false,
              translatedText: null,
              error: null,
            };

            const originalText =
              (c as any).text ?? (c as any).content ?? '';
            const textToShow =
              state.isHindi && state.translatedText
                ? state.translatedText
                : originalText;

            const buttonLabel = state.isHindi
              ? 'Show English'
              : state.loading
              ? 'Translating...'
              : 'Translate to Hindi';

            const rawDate =
              (c as any).date ?? (c as any).createdAt ?? null;
            const dateLabel = (() => {
              if (!rawDate) return '';
              const d = new Date(rawDate);
              return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
            })();

            return (
              <View key={c.id} style={styles.commentCard}>
                <Text style={styles.commentText}>{textToShow}</Text>

                <TouchableOpacity
                  style={styles.itemTranslateButton}
                  onPress={() => handleToggleCommentTranslation(c)}
                  disabled={state.loading || !originalText}
                >
                  <Text style={styles.itemTranslateButtonText}>
                    {buttonLabel}
                  </Text>
                </TouchableOpacity>

                {state.error && (
                  <Text style={styles.translateErrorText}>{state.error}</Text>
                )}

                {dateLabel ? (
                  <Text style={styles.commentMeta}>{dateLabel}</Text>
                ) : null}
              </View>
            );
          })
        ) : (
          <Text style={styles.placeholderText}>
            No comments yet. Start the conversation!
          </Text>
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  errorText: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FF3B30',
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
  ratingsMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginBottom: 12,
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
  reviewBlock: {
    marginBottom: 16,
  },
  itemTranslateContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  itemTranslateButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#000',
    marginTop: 2,
  },
  itemTranslateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  commentCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  commentMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
});
