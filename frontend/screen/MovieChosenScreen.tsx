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
import {
  getMovieRatings,
  getMovieComments,
  // getMovieSummary,
  getMovieByCinecircleId,
} from '../services/moviesService';
import type { components } from '../types/api-generated';
import { t } from '../app/il8n/il8n';
import { UiTextKey } from '../app/il8n/keys';

type MovieChosenScreenProps = {
  movieId: string;
};

type Rating = components['schemas']['Rating'];
type Comment = components['schemas']['Comment'];
type Movie = components['schemas']['Movie'];
// type Summary = components["schemas"]["Summary"];

export default function MovieChosenScreen({ movieId }: MovieChosenScreenProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [summary, setSummary] = useState<Summary | null>(null);
  // const [summaryLoading, setSummaryLoading] = useState(false);
  // const [summaryError, setSummaryError] = useState<string | null>(null);

  const [movieEnvelope, setMovieEnvelope] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        console.log('=== FETCH MOVIE DATA START ===');
        console.log('Movie ID:', movieId);

        setLoading(true);
        setError(null);
        // setSummaryError(null);

        // Optional: fetch movie meta (title, description, etc.)
        try {
          const movieRes = await getMovieByCinecircleId(movieId);
          console.log('Movie envelope:', JSON.stringify(movieRes, null, 2));
          const m = movieRes.data ?? movieRes;
          setMovieEnvelope(m as Movie);
        } catch (metaErr) {
          console.log('Failed to fetch movie meta (non-fatal):', metaErr);
        }

        const ratingsResponse = await getMovieRatings(movieId);
        const commentsResponse = await getMovieComments(movieId);

        setRatings(ratingsResponse.ratings || []);
        setComments(commentsResponse.comments || []);

        // setSummaryLoading(true);
        // try {
        //   const summaryResponse = await getMovieSummary(movieId);
        //   // setSummary(summaryResponse);
        // } catch (summaryErr: any) {
        //   console.error('Error fetching AI summary:', summaryErr?.message);
        //   // setSummaryError(t(UiTextKey.FailedToLoadAiSummary));
        // }
      } catch (err: any) {
        console.error('=== FETCH MOVIE DATA ERROR ===');
        console.error('Error type:', err?.constructor?.name);
        console.error('Error message:', err?.message);
        setError(t(UiTextKey.FailedToLoadMovieData));
        // setSummaryError(t(UiTextKey.FailedToLoadAiSummary));
      } finally {
        setLoading(false);
        // setSummaryLoading(false);
        console.log('=== FETCH MOVIE DATA END ===');
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
    return Number((sum / ratings.length).toFixed(1));
  };

  const getAllTags = () => {
    const allTags = ratings.flatMap(r => r.tags || []);
    const uniqueTags = [...new Set(allTags)].slice(0, 5);
    return uniqueTags;
  };

  const title = movieEnvelope?.title ?? 'Inception';
  const description =
    movieEnvelope?.description ??
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.';

  return (
    <ScrollView style={styles.container}>
      <SearchBar />

      {/* Movie Title + metadata (can later be fully dynamic) */}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.metaContainer}>
        {/* You can swap this to real year/director when your movie model supports it */}
        <Text style={styles.metaText}>
          2010 • Directed by: Christopher Nolan
        </Text>
        <Text style={styles.genreText}>Action • Sci-Fi • Thriller</Text>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {!loading && getAllTags().length > 0 && <TagList tags={getAllTags()} />}

      {/* <View style={styles.summaryContainer}>
        <Text style={styles.sectionHeader}>{t(UiTextKey.AiSummary)}</Text>

        {summaryLoading && (
          <View style={styles.summaryLoadingRow}>
            <ActivityIndicator size="small" />
            <Text style={styles.summaryLoadingText}>
              {/* can i18n this sentence later if you want */}
      {/* Analyzing reviews...
            </Text>
          </View>
        )}

        {summaryError && !summaryLoading && (
          <Text style={styles.summaryErrorText}>{summaryError}</Text>
        )}

        {summary && !summaryLoading && !summaryError && (
          <>
            <Text style={styles.summaryOverall}>{summary.movieId}</Text>

            <View style={styles.summaryRow}>
              {summary.pros?.length > 0 && (
                <View style={styles.summaryColumn}>
                  <Text style={styles.summarySubheader}>
                    {t(UiTextKey.PeopleLiked)}
                  </Text>
                  {summary.pros.slice(0, 3).map((item, idx) => (
                    <Text key={`pro-${idx}`} style={styles.summaryBullet}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {summary.cons?.length > 0 && (
                <View style={styles.summaryColumn}>
                  <Text style={styles.summarySubheader}>
                    {t(UiTextKey.CommonComplaints)}
                  </Text>
                  {summary.cons.slice(0, 3).map((item, idx) => (
                    <Text key={`con-${idx}`} style={styles.summaryBullet}>
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
            
            {summary.stats && (
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  👍 {summary.stats.positive} {t(UiTextKey.PositiveCount)}
                </Text>
                <Text style={styles.statsText}>
                  😐 {summary.stats.neutral} {t(UiTextKey.NeutralCount)}
                </Text>
                <Text style={styles.statsText}>
                  👎 {summary.stats.negative} {t(UiTextKey.NegativeCount)}
                </Text>
                <Text style={styles.statsTotalText}>
                  {t(UiTextKey.BasedOnReviews).replace(
                    "{count}",
                    String(summary.stats.total ?? 0)
                  )}
                </Text>
              </View>
            )}

            {summary.quotes && summary.quotes.length > 0 && (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteLabel}>
                  {t(UiTextKey.RepresentativeComment)}
                </Text>
                <Text style={styles.quoteText}>"{summary.quotes[0]}"</Text>
              </View>
            )}
           
          </>
        )}
      </View> */}

      <View style={styles.ratingsContainer}>
        <RatingRow
          label={t(UiTextKey.CineCircleAverage)}
          rating={calculateAverageRating()}
        />
        <Text style={styles.ratingCount}>
          {t(UiTextKey.BasedOnReviews).replace(
            '{count}',
            String(ratings.length)
          )}
        </Text>
        <RatingRow label="Rotten Tomatoes" rating={0} />
        <RatingRow label="IMDB" rating={8.8} />
      </View>

      <ActionButtons />

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
            {t(UiTextKey.Reviews)} ({ratings.length})
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
            {t(UiTextKey.Comments)} ({comments.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>{t(UiTextKey.Loading)}</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : activeTab === 'reviews' ? (
          ratings.length > 0 ? (
            ratings.map(rating => (
              <ReviewCard key={rating.id} /* rating={rating} */ />
            ))
          ) : (
            <Text style={styles.placeholderText}>
              {t(UiTextKey.NoReviewsYet)} {t(UiTextKey.BeFirstToReview)}
            </Text>
          )
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <View key={comment.id} style={styles.commentCard}>
              <Text style={styles.commentText}>{comment.content}</Text>
              <Text style={styles.commentMeta}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.placeholderText}>
            {t(UiTextKey.NoCommentsYet)} {t(UiTextKey.StartConversation)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
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
  metaText: { fontSize: 14, color: '#666' },
  genreText: { fontSize: 14, color: '#666', marginTop: 4 },
  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#333',
  },
  summaryContainer: { backgroundColor: '#FFF', padding: 16, marginTop: 8 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  summaryLoadingRow: { flexDirection: 'row', alignItems: 'center' },
  summaryLoadingText: { marginLeft: 8, fontSize: 14, color: '#999' },
  summaryErrorText: { fontSize: 14, color: '#FF3B30' },
  summaryOverall: { fontSize: 15, color: '#333', marginBottom: 8 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 16,
  },
  summaryColumn: { flex: 1 },
  summarySubheader: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  summaryBullet: { fontSize: 13, color: '#555' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
  statsText: { fontSize: 12, color: '#666' },
  statsTotalText: { fontSize: 12, color: '#999' },
  quoteContainer: { marginTop: 10 },
  quoteLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  quoteText: { fontSize: 13, fontStyle: 'italic', color: '#444' },
  ratingsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 12,
  },
  ratingCount: {
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
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#000' },
  tabText: { fontSize: 16, color: '#999' },
  activeTabText: { color: '#000', fontWeight: '600' },
  contentContainer: { padding: 16 },
  loadingContainer: { paddingVertical: 32, alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#999' },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    paddingVertical: 32,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
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
  commentText: { fontSize: 15, color: '#333', marginBottom: 8 },
  commentMeta: { fontSize: 12, color: '#999' },
});
