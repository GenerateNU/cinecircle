import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Your existing components
import SearchBar from '../components/SearchBar';
import RatingRow from '../components/RatingRow';
import TagList from '../components/TagList';
import ActionButtons from '../components/ActionButtons';
import ReviewCard from '../components/ReviewCard';

/* =========================
   Types
   ========================= */
type Rating = {
  id: string;
  userId: string;
  movieId: string;
  stars: number;
  comment?: string | null;
  tags: string[];
  date: string;
  votes: number;
  threadedComments?: unknown[];
};

type Comment = {
  id: string;
  userId: string;
  ratingId?: string | null;
  postId?: string | null;
  content: string;
  createdAt: string;
  rating?: unknown;
  post?: unknown;
};

type Summary = {
  overall: string;
  pros: string[];
  cons: string[];
  stats: { positive: number; neutral: number; negative: number; total: number };
  quotes: string[];
};

/* =========================
   Sample data (replace later)
   ========================= */
const sampleRatings: Rating[] = [
  {
    id: 'r1',
    userId: 'u1',
    movieId: 'm1',
    stars: 4,
    comment: 'Beautiful cinematography and an incredible score. I loved the color palette.',
    tags: ['cinematography', 'soundtrack'],
    date: '2025-01-01',
    votes: 7,
  },
  {
    id: 'r2',
    userId: 'u2',
    movieId: 'm1',
    stars: 3,
    comment: 'Drags in the middle but the ending stuck with me; pacing is uneven.',
    tags: ['pacing'],
    date: '2025-01-02',
    votes: 3,
  },
];

const sampleComments: Comment[] = [
  {
    id: 'c1',
    userId: 'u9',
    ratingId: null,
    postId: null,
    content: 'Performances were uneven; the lead was great though.',
    createdAt: '2025-01-03',
  },
  {
    id: 'c2',
    userId: 'u10',
    ratingId: null,
    postId: null,
    content: 'Soundtrack absolutely slapped; I’ve replayed it all week.',
    createdAt: '2025-01-04',
  },
];

/* =========================
   UI: Consensus card
   ========================= */
const SummaryCard: React.FC<{ summary: Summary | null }> = ({ summary }) => {
  if (!summary) return null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Consensus</Text>
      <Text style={styles.summaryOverall}>
        {summary.overall || 'Not enough reviews yet.'}
      </Text>

      <View style={styles.summaryCols}>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryColTitle}>Pros</Text>
          {summary.pros?.map((p, i) => (
            <Text key={`pro-${i}`} style={styles.quote}>“{p}”</Text>
          ))}
        </View>
        <View style={styles.summaryCol}>
          <Text style={styles.summaryColTitle}>Cons</Text>
          {summary.cons?.map((c, i) => (
            <Text key={`con-${i}`} style={styles.quote}>“{c}”</Text>
          ))}
        </View>
      </View>

      <Text style={styles.summaryFooter}>
        Crowd sentiment: {summary.stats?.positive ?? 0}% positive · {summary.stats?.neutral ?? 0}% neutral · {summary.stats?.negative ?? 0}% negative
      </Text>
    </View>
  );
};

/* =========================
   Screen
   ========================= */
export default function MovieChosenScreen() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

  // Typed state — CRITICAL so setSummary(mock) works
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    // --- MOCK: render something now ---
    const mock: Summary = {
      overall:
        'Gorgeous visuals and a standout soundtrack, though the pacing dips in the middle.',
      pros: [
        'Beautiful cinematography and cohesive color palette',
        'Memorable score that elevates key scenes',
      ],
      cons: [
        'Uneven pacing in Act 2',
        'Some performances feel inconsistent',
      ],
      stats: { positive: 68, neutral: 18, negative: 14, total: 4 },
      quotes: [
        'Beautiful cinematography and an incredible score.',
        'Drags in the middle but the ending stuck with me.',
        'Performances were uneven; the lead was great though.',
        'Soundtrack absolutely slapped; I’ve replayed it all week.',
      ],
    };
    setSummary(mock);

    // --- REAL CALL (uncomment when backend is ready) ---
    // const BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://192.168.x.x:4000/api';
    // fetch(`${BASE}/summarize/movie`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     movieId: 'm1',                 // replace with your actual movie id
    //     ratings: sampleRatings,        // replace with real data
    //     comments: sampleComments,      // replace with real data
    //   }),
    // })
    //   .then(r => r.json())
    //   .then(json => setSummary(json.data as Summary))
    //   .catch(err => console.warn('summarize error', err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <SearchBar />

      {/* Movie Title */}
      <Text style={styles.title}>Movie Title</Text>

      {/* Metadata */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>2025 • Directed by: Emily Chooi</Text>
        <Text style={styles.genreText}>Genre • Genre • Genre • Genre • Genre</Text>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Text>

      {/* Tags */}
      <TagList tags={['Cinematography', 'Soundtrack', 'Drama']} />

      {/* Ratings */}
      <View style={styles.ratingsContainer}>
        <RatingRow label="Overall" rating={4} />
        <RatingRow label="Rotten Tomatoes" rating={0} />
        <RatingRow label="IBM" rating={0} />
      </View>

      {/* Action Buttons */}
      <ActionButtons />

      {/* Consensus summary card */}
      <SummaryCard summary={summary} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
            Reviews
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
            Comments
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'reviews' ? (
          <>
            {/* Map real ratings into ReviewCard props if needed */}
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

/* =========================
   Styles
   ========================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },

  metaContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  metaText: { fontSize: 14, color: '#666' },
  genreText: { fontSize: 14, color: '#666', marginTop: 4 },

  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#333',
  },

  ratingsContainer: { backgroundColor: '#FFF', padding: 16, marginTop: 12 },

  // Summary card
  summaryCard: {
    backgroundColor: '#FFF',
    marginTop: 12,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
  },
  summaryTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  summaryOverall: { fontSize: 14, color: '#222', marginBottom: 10 },
  summaryCols: { flexDirection: 'row', gap: 16 },
  summaryCol: { flex: 1 },
  summaryColTitle: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#333' },
  quote: { fontSize: 13, color: '#444', marginBottom: 4 },
  summaryFooter: { fontSize: 12, color: '#666', marginTop: 10 },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginTop: 12,
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#000' },
  tabText: { fontSize: 16, color: '#999' },
  activeTabText: { color: '#000', fontWeight: '600' },

  contentContainer: { padding: 16 },
  placeholderText: { fontSize: 16, color: '#999', textAlign: 'center', paddingVertical: 32 },
});
