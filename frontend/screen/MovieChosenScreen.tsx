import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import TagList from '../components/TagList';
import ReviewPost from '../components/ReviewPost';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import InteractionBar from '../components/InteractionBar';
import UserBar from '../components/UserBar';
import StarRating from '../components/StarRating';
import AiConsensus from '../components/AiConsensus';
import SpoilerButton from '../components/SpoilerButton';
import CreatePostModal from '../screen/createPostModal';
import {
  getMovieSummary,
  getMovieByCinecircleId,
} from '../services/moviesService';
import { getPosts } from '../services/postsService';
import { togglePostReaction } from '../services/feedService';
import { getMoviePosterUrl } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import type { components } from '../types/api-generated';
import { t } from '../il8n/_il8n';
import { UiTextKey } from '../il8n/_keys';
import { getUserProfile, updateUserProfile } from '../services/userService';
import BookmarkModal from './bookmarkModal';

type MovieChosenScreenProps = {
  movieId: string;
};

type Post = components['schemas']['Post'];
type Movie = components['schemas']['Movie'];
type Summary = components['schemas']['MovieSummary'];

type FeedItem = {
  type: 'post';
  data: Post;
  date: string;
};

type BookmarkStatus = 'TO_WATCH' | 'WATCHED' | null;

const { width } = Dimensions.get('window');

// /** ================= Bookmark Modal ================= */

// type BookmarkModalProps = {
//   visible: boolean;
//   currentSelection: BookmarkStatus;
//   onChangeSelection: (s: BookmarkStatus) => void;
//   onSave: () => void;
//   onClose: () => void;
// };

// const BookmarkModal: React.FC<BookmarkModalProps> = ({
//   visible,
//   currentSelection,
//   onChangeSelection,
//   onSave,
//   onClose,
// }) => {
//   const selectTicket = (status: Exclude<BookmarkStatus, null>) => {
//     // tap again to unselect (=> remove)
//     if (currentSelection === status) {
//       onChangeSelection(null);
//     } else {
//       onChangeSelection(status);
//     }
//   };

//   const isToWatch = currentSelection === 'TO_WATCH';
//   const isWatched = currentSelection === 'WATCHED';

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalBackdrop}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Save movie to list</Text>

//           <View style={styles.modalTicketsRow}>
//             {/* Want to Watch */}
//             <Pressable
//               onPress={() => selectTicket('TO_WATCH')}
//               style={[
//                 styles.ticketOuter,
//                 isToWatch && styles.ticketOuterActive,
//               ]}
//             >
//               <View
//                 style={[
//                   styles.ticketInner,
//                   isToWatch && styles.ticketInnerActive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.ticketText,
//                     isToWatch && styles.ticketTextActive,
//                   ]}
//                 >
//                   Want to{'\n'}Watch
//                 </Text>
//               </View>
//             </Pressable>

//             {/* Watched */}
//             <Pressable
//               onPress={() => selectTicket('WATCHED')}
//               style={[
//                 styles.ticketOuter,
//                 isWatched && styles.ticketOuterActive,
//               ]}
//             >
//               <View
//                 style={[
//                   styles.ticketInner,
//                   isWatched && styles.ticketInnerActive,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.ticketText,
//                     isWatched && styles.ticketTextActive,
//                   ]}
//                 >
//                   Watched
//                 </Text>
//               </View>
//             </Pressable>
//           </View>

//           <View style={styles.modalActionsRow}>
//             <TouchableOpacity
//               onPress={onClose}
//               style={[styles.modalButton, styles.modalButtonSecondary]}
//             >
//               <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={onSave}
//               disabled={currentSelection === null}
//               style={[
//                 styles.modalButton,
//                 currentSelection === null
//                   ? styles.modalButtonDisabled
//                   : styles.modalButtonPrimary,
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.modalButtonPrimaryText,
//                   currentSelection === null && { color: '#999' },
//                 ]}
//               >
//                 Save
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

/** ================= Main Screen ================= */

export default function MovieChosenScreen({ movieId }: MovieChosenScreenProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [movieEnvelope, setMovieEnvelope] = useState<Movie | null>(null);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [sortOrder, setSortOrder] = useState<'trending' | 'new' | 'top'>(
    'trending'
  );
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [bookmarkStatus, setBookmarkStatus] = useState<BookmarkStatus>(null);
  const [bookmarkSelection, setBookmarkSelection] =
    useState<BookmarkStatus>(null);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);

  /** ---- Load bookmark state on mount / movie change ---- */
  useEffect(() => {
    const loadBookmarkState = async () => {
      try {
        const res = await getUserProfile();
        const profile = res.userProfile;
        if (!profile) return;

        const toWatch = profile.bookmarkedToWatch ?? [];
        const watched = profile.bookmarkedWatched ?? [];

        if (toWatch.includes(movieId)) {
          setBookmarkStatus('TO_WATCH');
        } else if (watched.includes(movieId)) {
          setBookmarkStatus('WATCHED');
        } else {
          setBookmarkStatus(null);
        }
      } catch (err) {
        console.error('Failed to load bookmark state:', err);
      }
    };

    if (movieId) {
      loadBookmarkState();
    }
  }, [movieId]);

  /** ---- Fetch movie + posts ---- */
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        console.log('=== FETCH MOVIE DATA START ===');
        console.log('Movie ID:', movieId);

        setLoading(true);
        setError(null);

        // Reset summary when switching movies
        setSummary(null);
        setSummaryError(null);
        setSummaryLoading(false);

        try {
          const movieRes = await getMovieByCinecircleId(movieId);
          console.log('Movie envelope:', JSON.stringify(movieRes, null, 2));
          const m = (movieRes as any).data ?? movieRes;
          setMovieEnvelope(m as Movie);
        } catch (metaErr) {
          console.log('Failed to fetch movie meta (non-fatal):', metaErr);
        }

        const postsResponse = await getPosts({
          movieId,
          currentUserId: user?.id,
        });

        setPosts(postsResponse || []);
      } catch (err: any) {
        console.error('=== FETCH MOVIE DATA ERROR ===');
        console.error('Error type:', err?.constructor?.name);
        console.error('Error message:', err?.message);
        setError(t(UiTextKey.FailedToLoadMovieData));
      } finally {
        setLoading(false);
        console.log('=== FETCH MOVIE DATA END ===');
      }
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId, user?.id]);

  /** ---- Auto-generate summary ---- */
  useEffect(() => {
    const generateSummary = async () => {
      console.log('Auto-generating AI summary for movieId:', movieId);
      if (!movieId) return;

      try {
        setSummaryError(null);
        setSummary(null);
        setSummaryLoading(true);

        const summaryResponse = await getMovieSummary(movieId);
        console.log('AI summary response:', summaryResponse);

        setSummary(summaryResponse);
      } catch (err: any) {
        console.error('Error fetching AI summary:', err?.message);
        setSummaryError(t(UiTextKey.FailedToLoadAiSummary));
      } finally {
        setSummaryLoading(false);
      }
    };

    if (movieId) {
      generateSummary();
    }
  }, [movieId]);

  /** ---- Helpers ---- */

  const calculateAverageRating = () => {
    const postsWithStars = posts.filter(
      p => p.stars !== null && p.stars !== undefined
    );
    if (postsWithStars.length === 0) return 0;
    const sum = postsWithStars.reduce((acc, p) => acc + (p.stars || 0), 0);
    return Number((sum / postsWithStars.length).toFixed(1));
  };

  const getAllTags = () => {
    const allTags = posts.flatMap(p => p.tags || []);
    const uniqueTags = [...new Set(allTags)].slice(0, 5);
    return uniqueTags.map(tag =>
      tag
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    );
  };

  const title = movieEnvelope?.title ?? 'Unknown Movie';
  const description = movieEnvelope?.description ?? '';
  const releaseYear = movieEnvelope?.releaseYear;
  const director = movieEnvelope?.director;

  const imdbRating = movieEnvelope?.imdbRating
    ? Number(movieEnvelope.imdbRating) / 2
    : null;
  const imdbRatingCount = movieEnvelope?.numRatings
    ? Number(movieEnvelope.numRatings)
    : null;

  const handleReviewPress = (post: Post) => {
    console.log('Review pressed:', post.id, 'Movie:', post.movieId);
  };

  const handlePostPress = (post: Post) => {
    console.log('Post pressed:', post.id, 'Movie:', post.movieId);
  };

  const handleAddPost = () => {
    setShowPostModal(true);
  };

  const handlePostTypeSelect = (type: 'short' | 'long') => {
    setShowPostModal(false);
    router.push({
      pathname: '/form',
      params: {
        type,
        movieId,
        movieTitle: title,
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(2)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(2)}k`;
    return count.toString();
  };

  const handleComment = (post: Post) => {
    console.log('Comment button pressed for post:', post.id);
  };

  const getFeedItems = (): FeedItem[] =>
    posts.map(post => ({
      type: 'post' as const,
      data: post,
      date: post.createdAt,
    }));

  /** ---- Bookmark handlers ---- */

  const openBookmarkModal = () => {
    setBookmarkSelection(bookmarkStatus ?? 'TO_WATCH');
    setShowBookmarkModal(true);
  };

  const handleBookmarkSave = async () => {
    try {
      const res = await getUserProfile();
      const profile = res.userProfile;
      if (!profile) return;

      let toWatch = [...(profile.bookmarkedToWatch ?? [])];
      let watched = [...(profile.bookmarkedWatched ?? [])];

      // Strip this movie out from both lists first
      toWatch = toWatch.filter(id => id !== movieId);
      watched = watched.filter(id => id !== movieId);

      if (bookmarkSelection === 'TO_WATCH') {
        if (!toWatch.includes(movieId)) toWatch.push(movieId);
      } else if (bookmarkSelection === 'WATCHED') {
        if (!watched.includes(movieId)) watched.push(movieId);
      } else {
        // null => stays removed from both
      }

      console.log('[FE] handleBookmarkSave selection:', bookmarkSelection);
      console.log('[FE] sending bookmark update:', {
        bookmarkedToWatch: toWatch,
        bookmarkedWatched: watched,
      });

      await updateUserProfile({
        bookmarkedToWatch: toWatch,
        bookmarkedWatched: watched,
      });

      setBookmarkStatus(bookmarkSelection);
      setShowBookmarkModal(false);
    } catch (err) {
      console.error('Failed to save bookmark:', err);
    }
  };

  const feedItems = getFeedItems();
  const moviePosterUrl = getMoviePosterUrl(movieEnvelope?.imageUrl);
  const isBookmarked = bookmarkStatus !== null;

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={{ uri: moviePosterUrl }}
            style={styles.heroContainer}
            imageStyle={styles.heroImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={[
                'transparent',
                'rgba(0,0,0,0.3)',
                'rgba(0,0,0,0.8)',
                '#000000',
              ]}
              locations={[0, 0.4, 0.7, 0.85]}
              style={styles.gradient}
            >
              <View style={styles.heroContent}>
                <Text style={styles.title}>{title}</Text>
                {(releaseYear || director) && (
                  <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>
                      {releaseYear && releaseYear}
                      {releaseYear && director && ' • '}
                      {director && `Directed by: ${director}`}
                    </Text>
                  </View>
                )}
                {description && (
                  <Text style={styles.description} numberOfLines={3}>
                    {description}
                  </Text>
                )}
              </View>
            </LinearGradient>
          </ImageBackground>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Tags */}
        {!loading && getAllTags().length > 0 && (
          <View style={styles.tagsSection}>
            <TagList tags={getAllTags()} variant="blue" />
          </View>
        )}

        {/* Ratings + Bookmark */}
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingsRow}>
            <View style={styles.ratingsContentWrapper}>
              <View style={styles.labelsColumn}>
                <Text style={styles.ratingLabel}>
                  {t(UiTextKey.CineCircleAverage)}
                </Text>
                <Text style={styles.ratingLabel}>IMDB Rating</Text>
              </View>
              <View style={styles.starsColumn}>
                <View style={styles.starRow}>
                  <StarRating
                    rating={calculateAverageRating()}
                    maxStars={5}
                    size={24}
                  />
                  <Text style={styles.ratingCount}>
                    {
                      posts.filter(
                        p => p.stars !== null && p.stars !== undefined
                      ).length
                    }
                  </Text>
                </View>
                {imdbRating !== null && (
                  <View style={styles.starRow}>
                    <StarRating rating={imdbRating} maxStars={5} size={24} />
                    {imdbRatingCount && (
                      <Text style={styles.ratingCount}>
                        {formatCount(imdbRatingCount)}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Bookmark Button -> opens modal */}
            <TouchableOpacity
              style={[
                styles.bookmarkButton,
                isBookmarked && {
                  backgroundColor: '#5C013F',
                  borderColor: '#5C013F',
                },
              ]}
              onPress={openBookmarkModal}
              activeOpacity={0.85}
            >
              <Svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                <Path
                  d="M0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H8V2H2V14.95L7 12.8L12 14.95V8H14V18L7 15L0 18ZM12 6V4H10V2H12V0H14V2H16V4H14V6H12Z"
                  fill={isBookmarked ? '#FFFFFF' : '#AB2504'}
                />
              </Svg>
              <Text
                style={{
                  marginLeft: 8,
                  color: isBookmarked ? '#FBEAE6' : '#561202',
                  fontWeight: '600',
                }}
              >
                {bookmarkStatus === 'TO_WATCH'
                  ? 'Want to Watch'
                  : bookmarkStatus === 'WATCHED'
                    ? 'Watched'
                    : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <SpoilerButton isSpoiler={showSpoilers} onToggle={setShowSpoilers} />

          <TouchableOpacity
            style={styles.sortDropdown}
            onPress={() => setShowSortDropdown(!showSortDropdown)}
            activeOpacity={0.8}
          >
            {sortOrder === 'trending' && (
              <>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M6 14C6 14.8667 6.175 15.6875 6.525 16.4625C6.875 17.2375 7.375 17.9167 8.025 18.5C8.00833 18.4167 8 18.3417 8 18.275V18.05C8 17.5167 8.1 17.0167 8.3 16.55C8.5 16.0833 8.79167 15.6583 9.175 15.275L12 12.5L14.825 15.275C15.2083 15.6583 15.5 16.0833 15.7 16.55C15.9 17.0167 16 17.5167 16 18.05V18.275C16 18.3417 15.9917 18.4167 15.975 18.5C16.625 17.9167 17.125 17.2375 17.475 16.4625C17.825 15.6875 18 14.8667 18 14C18 13.1667 17.8458 12.3792 17.5375 11.6375C17.2292 10.8958 16.7833 10.2333 16.2 9.65C15.8667 9.86667 15.5167 10.0292 15.15 10.1375C14.7833 10.2458 14.4083 10.3 14.025 10.3C12.9917 10.3 12.0958 9.95833 11.3375 9.275C10.5792 8.59167 10.1417 7.75 10.025 6.75C9.375 7.3 8.8 7.87083 8.3 8.4625C7.8 9.05417 7.37917 9.65417 7.0375 10.2625C6.69583 10.8708 6.4375 11.4917 6.2625 12.125C6.0875 12.7583 6 13.3833 6 14ZM12 15.3L10.575 16.7C10.3917 16.8833 10.25 17.0917 10.15 17.325C10.05 17.5583 10 17.8 10 18.05C10 18.5833 10.1958 19.0417 10.5875 19.425C10.9792 19.8083 11.45 20 12 20C12.55 20 13.0208 19.8083 13.4125 19.425C13.8042 19.0417 14 18.5833 14 18.05C14 17.7833 13.95 17.5375 13.85 17.3125C13.75 17.0875 13.6083 16.8833 13.425 16.7L12 15.3ZM12 3V6.3C12 6.86667 12.1958 7.34167 12.5875 7.725C12.9792 8.10833 13.4583 8.3 14.025 8.3C14.325 8.3 14.6042 8.2375 14.8625 8.1125C15.1208 7.9875 15.35 7.8 15.55 7.55L16 7C17.2333 7.7 18.2083 8.675 18.925 9.925C19.6417 11.175 20 12.5333 20 14C20 16.2333 19.225 18.125 17.675 19.675C16.125 21.225 14.2333 22 12 22C9.76667 22 7.875 21.225 6.325 19.675C4.775 18.125 4 16.2333 4 14C4 11.85 4.72083 9.80833 6.1625 7.875C7.60417 5.94167 9.55 4.31667 12 3Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.sortText}>Trending</Text>
              </>
            )}
            {sortOrder === 'new' && (
              <>
                <Svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <Path
                    d="M7.5 15.5C5.41667 15.5 3.64583 14.7708 2.1875 13.3125C0.729167 11.8542 0 10.0833 0 8C0 5.91667 0.729167 4.14583 2.1875 2.6875C3.64583 1.22917 5.41667 0.5 7.5 0.5C9.58333 0.5 11.3542 1.22917 12.8125 2.6875C14.2708 4.14583 15 5.91667 15 8C15 10.0833 14.2708 11.8542 12.8125 13.3125C11.3542 14.7708 9.58333 15.5 7.5 15.5ZM17.5 16V3.8L16.4 4.9L15 3.5L18.5 0L22 3.5L20.575 4.9L19.5 3.825V16H17.5ZM7.5 13.5C9.03333 13.5 10.3333 12.9667 11.4 11.9C12.4667 10.8333 13 9.53333 13 8C13 6.46667 12.4667 5.16667 11.4 4.1C10.3333 3.03333 9.03333 2.5 7.5 2.5C5.96667 2.5 4.66667 3.03333 3.6 4.1C2.53333 5.16667 2 6.46667 2 8C2 9.53333 2.53333 10.8333 3.6 11.9C4.66667 12.9667 5.96667 13.5 7.5 13.5ZM9.5 11.5L10.9 10.1L8.5 7.675V4H6.5V8.5L9.5 11.5Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.sortText}>New</Text>
              </>
            )}
            {sortOrder === 'top' && (
              <>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 21V15H3L12 4L21 15H16V21H8ZM10 19H14V13H16.775L12 7.15L7.225 13H10V19Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.sortText}>Top</Text>
              </>
            )}
            <Ionicons
              name={showSortDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#561202"
            />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {showSortDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSortOrder('trending');
                  setShowSortDropdown(false);
                }}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M6 14C6 14.8667 6.175 15.6875 6.525 16.4625C6.875 17.2375 7.375 17.9167 8.025 18.5C8.00833 18.4167 8 18.3417 8 18.275V18.05C8 17.5167 8.1 17.0167 8.3 16.55C8.5 16.0833 8.79167 15.6583 9.175 15.275L12 12.5L14.825 15.275C15.2083 15.6583 15.5 16.0833 15.7 16.55C15.9 17.0167 16 17.5167 16 18.05V18.275C16 18.3417 15.9917 18.4167 15.975 18.5C16.625 17.9167 17.125 17.2375 17.475 16.4625C17.825 15.6875 18 14.8667 18 14C18 13.1667 17.8458 12.3792 17.5375 11.6375C17.2292 10.8958 16.7833 10.2333 16.2 9.65C15.8667 9.86667 15.5167 10.0292 15.15 10.1375C14.7833 10.2458 14.4083 10.3 14.025 10.3C12.9917 10.3 12.0958 9.95833 11.3375 9.275C10.5792 8.59167 10.1417 7.75 10.025 6.75C9.375 7.3 8.8 7.87083 8.3 8.4625C7.8 9.05417 7.37917 9.65417 7.0375 10.2625C6.69583 10.8708 6.4375 11.4917 6.2625 12.125C6.0875 12.7583 6 13.3833 6 14ZM12 15.3L10.575 16.7C10.3917 16.8833 10.25 17.0917 10.15 17.325C10.05 17.5583 10 17.8 10 18.05C10 18.5833 10.1958 19.0417 10.5875 19.425C10.9792 19.8083 11.45 20 12 20C12.55 20 13.0208 19.8083 13.4125 19.425C13.8042 19.0417 14 18.5833 14 18.05C14 17.7833 13.95 17.5375 13.85 17.3125C13.75 17.0875 13.6083 16.8833 13.425 16.7L12 15.3ZM12 3V6.3C12 6.86667 12.1958 7.34167 12.5875 7.725C12.9792 8.10833 13.4583 8.3 14.025 8.3C14.325 8.3 14.6042 8.2375 14.8625 8.1125C15.1208 7.9875 15.35 7.8 15.55 7.55L16 7C17.2333 7.7 18.2083 8.675 18.925 9.925C19.6417 11.175 20 12.5333 20 14C20 16.2333 19.225 18.125 17.675 19.675C16.125 21.225 14.2333 22 12 22C9.76667 22 7.875 21.225 6.325 19.675C4.775 18.125 4 16.2333 4 14C4 11.85 4.72083 9.80833 6.1625 7.875C7.60417 5.94167 9.55 4.31667 12 3Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.dropdownItemText}>Trending</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSortOrder('new');
                  setShowSortDropdown(false);
                }}
              >
                <Svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  <Path
                    d="M7.5 15.5C5.41667 15.5 3.64583 14.7708 2.1875 13.3125C0.729167 11.8542 0 10.0833 0 8C0 5.91667 0.729167 4.14583 2.1875 2.6875C3.64583 1.22917 5.41667 0.5 7.5 0.5C9.58333 0.5 11.3542 1.22917 12.8125 2.6875C14.2708 4.14583 15 5.91667 15 8C15 10.0833 14.2708 11.8542 12.8125 13.3125C11.3542 14.7708 9.58333 15.5 7.5 15.5ZM17.5 16V3.8L16.4 4.9L15 3.5L18.5 0L22 3.5L20.575 4.9L19.5 3.825V16H17.5ZM7.5 13.5C9.03333 13.5 10.3333 12.9667 11.4 11.9C12.4667 10.8333 13 9.53333 13 8C13 6.46667 12.4667 5.16667 11.4 4.1C10.3333 3.03333 9.03333 2.5 7.5 2.5C5.96667 2.5 4.66667 3.03333 3.6 4.1C2.53333 5.16667 2 6.46667 2 8C2 9.53333 2.53333 10.8333 3.6 11.9C4.66667 12.9667 5.96667 13.5 7.5 13.5ZM9.5 11.5L10.9 10.1L8.5 7.675V4H6.5V8.5L9.5 11.5Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.dropdownItemText}>New</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dropdownItem, styles.dropdownItemLast]}
                onPress={() => {
                  setSortOrder('top');
                  setShowSortDropdown(false);
                }}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 21V15H3L12 4L21 15H16V21H8ZM10 19H14V13H16.775L12 7.15L7.225 13H10V19Z"
                    fill="#561202"
                  />
                </Svg>
                <Text style={styles.dropdownItemText}>Top</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* AI Consensus */}
        <AiConsensus
          summary={summary}
          summaryLoading={summaryLoading}
          summaryError={summaryError}
        />

        {/* Feed */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>{t(UiTextKey.Loading)}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : feedItems.length > 0 ? (
          feedItems.map((item, index) => {
            if (item.type !== 'post') return null;
            const post = item.data;
            const username = post.UserProfile?.username || 'Unknown';
            const movieImagePath =
              post.movie?.imageUrl || movieEnvelope?.imageUrl;
            const moviePosterUrlItem = getMoviePosterUrl(movieImagePath);

            if (post.stars !== null && post.stars !== undefined) {
              return (
                <React.Fragment key={`post-${post.id}`}>
                  <View style={styles.reviewItemContainer}>
                    <UserBar
                      name={username}
                      username={username}
                      userId={post.userId}
                    />
                    <Text style={styles.reviewShareText}>
                      Check out this new review that I just dropped!
                    </Text>
                    <ReviewPost
                      userName={username}
                      username={username}
                      date={formatDate(post.createdAt)}
                      reviewerName={username}
                      movieTitle={title}
                      rating={post.stars}
                      userId={post.userId}
                      reviewerUserId={post.userId}
                      movieImageUrl={moviePosterUrlItem}
                      onPress={() => handleReviewPress(post)}
                    />
                  </View>
                  {index < feedItems.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              );
            }

            const hasImage = post.imageUrls && post.imageUrls.length > 0;

            const reactions = [
              {
                emoji: '🌶️',
                count: post.reactionCounts?.SPICY || 0,
                selected: post.userReactions?.includes('SPICY') || false,
              },
              {
                emoji: '✨',
                count: post.reactionCounts?.STAR_STUDDED || 0,
                selected: post.userReactions?.includes('STAR_STUDDED') || false,
              },
              {
                emoji: '🧠',
                count: post.reactionCounts?.THOUGHT_PROVOKING || 0,
                selected:
                  post.userReactions?.includes('THOUGHT_PROVOKING') || false,
              },
              {
                emoji: '🧨',
                count: post.reactionCounts?.BLOCKBUSTER || 0,
                selected: post.userReactions?.includes('BLOCKBUSTER') || false,
              },
            ];

            const handleReaction = async (reactionIndex: number) => {
              if (!user?.id) return;
              const reactionTypes: Array<
                'SPICY' | 'STAR_STUDDED' | 'THOUGHT_PROVOKING' | 'BLOCKBUSTER'
              > = ['SPICY', 'STAR_STUDDED', 'THOUGHT_PROVOKING', 'BLOCKBUSTER'];
              const reactionType = reactionTypes[reactionIndex];

              try {
                setPosts(prevPosts =>
                  prevPosts.map(p => {
                    if (p.id !== post.id) return p;
                    const wasSelected =
                      p.userReactions?.includes(reactionType) || false;
                    const newReactionCounts = { ...p.reactionCounts };
                    if (wasSelected) {
                      newReactionCounts[reactionType] = Math.max(
                        0,
                        (newReactionCounts[reactionType] || 0) - 1
                      );
                    } else {
                      newReactionCounts[reactionType] =
                        (newReactionCounts[reactionType] || 0) + 1;
                    }
                    let newUserReactions = [...(p.userReactions || [])];
                    if (wasSelected) {
                      newUserReactions = newUserReactions.filter(
                        r => r !== reactionType
                      );
                    } else {
                      newUserReactions.push(reactionType);
                    }
                    return {
                      ...p,
                      reactionCounts: newReactionCounts,
                      userReactions: newUserReactions,
                    } as Post;
                  })
                );
                await togglePostReaction(post.id, user.id, reactionType);
              } catch (error) {
                console.error('Error toggling reaction:', error);
                try {
                  const postsResponse = await getPosts({
                    movieId,
                    currentUserId: user?.id,
                  });
                  setPosts(postsResponse || []);
                } catch (reloadError) {
                  console.error('Error reloading posts:', reloadError);
                }
              }
            };

            return (
              <React.Fragment key={`post-${post.id}`}>
                <View style={styles.postContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handlePostPress(post)}
                  >
                    {hasImage ? (
                      <PicturePost
                        userName={username}
                        username={username}
                        date={formatDate(post.createdAt)}
                        content={post.content}
                        imageUrls={post.imageUrls || []}
                        userId={post.userId}
                      />
                    ) : (
                      <TextPost
                        userName={username}
                        username={username}
                        date={formatDate(post.createdAt)}
                        content={post.content}
                        userId={post.userId}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.interactionWrapper}>
                    <InteractionBar
                      initialComments={post.commentCount || 0}
                      reactions={reactions}
                      onCommentPress={() => handleComment(post)}
                      onReactionPress={handleReaction}
                    />
                  </View>
                </View>
                {index < feedItems.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.placeholderText}>
              No posts or reviews yet. Be the first!
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Post button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPost}
        activeOpacity={0.8}
      >
        <Svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <Path
            d="M32 64C23.5131 64 15.3737 60.6286 9.37258 54.6274C3.37142 48.6263 0 40.4869 0 32C0 23.5131 3.37142 15.3737 9.37258 9.37258C15.3737 3.37142 23.5131 0 32 0C40.4869 0 48.6263 3.37142 54.6274 9.37258C60.6286 15.3737 64 23.5131 64 32C64 40.4869 60.6286 48.6263 54.6274 54.6274C48.6263 60.6286 40.4869 64 32 64Z"
            fill="#D62E05"
          />
          <Path
            d="M35.2 28.8V16H28.8V28.8H16V35.2H28.8V48H35.2V35.2H48V28.8H35.2Z"
            fill="#FFFFFF"
          />
        </Svg>
      </TouchableOpacity>

      {/* Post type modal */}
      {showPostModal && (
        <CreatePostModal
          onSelect={handlePostTypeSelect}
          onClose={() => setShowPostModal(false)}
        />
      )}

      {/* Bookmark modal */}
      {/* Bookmark modal – bottom sheet style */}
      {showBookmarkModal && (
        <BookmarkModal
          selection={bookmarkSelection}
          onChangeSelection={setBookmarkSelection}
          onSave={handleBookmarkSave}
          onClose={() => setShowBookmarkModal(false)}
        />
      )}
    </View>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  heroWrapper: { position: 'relative', width: '100%' },
  heroContainer: { width: '100%', minHeight: width * 1.2 },
  heroImage: { width: '100%', height: '100%' },
  gradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { paddingBottom: 24 },
  title: {
    fontSize: 24,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metaContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  metaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tagsSection: { backgroundColor: '#ffffff', paddingTop: 8 },
  ratingsContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingsContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  labelsColumn: { marginRight: 16, gap: 16 },
  ratingLabel: { fontSize: 15, fontWeight: '500', color: '#000' },
  starsColumn: { gap: 4 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingCount: { fontSize: 12, color: 'black', fontWeight: '400' },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  loadingText: { marginTop: 12, fontSize: 16, color: '#999' },
  errorContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 8,
  },
  errorText: { fontSize: 16, color: '#FF3B30', textAlign: 'center' },
  emptyContainer: {
    backgroundColor: '#FFF',
    padding: 32,
    marginTop: 8,
  },
  placeholderText: { fontSize: 16, color: '#999', textAlign: 'center' },
  reviewItemContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.04,
    paddingBottom: width * 0.04,
  },
  postContainer: {
    backgroundColor: '#FFF',
    paddingTop: width * 0.04,
  },
  interactionWrapper: {
    paddingHorizontal: width * 0.04,
    paddingBottom: width * 0.04,
  },
  reviewShareText: {
    fontSize: width * 0.04,
    color: '#000',
    marginTop: width * 0.03,
    marginBottom: width * 0.04,
  },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 0 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    padding: 8,
    zIndex: 10,
  },
  bookmarkButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#5C013F',
    backgroundColor: '#F7D5CD',
    shadowColor: '#5C013F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
    marginLeft: 16,
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  sortText: { fontSize: 14, fontWeight: '400', color: '#561202' },
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 9999,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#561202',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  addButton: {
    position: 'absolute',
    bottom: 48,
    right: 24,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  /* Modal styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '86%',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  modalTicketsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ticketOuter: {
    flex: 1,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#F8B1A1',
    borderRadius: 16,
    backgroundColor: '#FFE4DC',
    padding: 6,
  },
  ticketOuterActive: {
    borderColor: '#7B3DF0',
  },
  ticketInner: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#F08A6A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  ticketInnerActive: {
    borderColor: '#7B3DF0',
  },
  ticketText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#E0643A',
    fontWeight: '600',
  },
  ticketTextActive: {
    color: '#7B3DF0',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
  },
  modalButtonSecondaryText: {
    color: '#555',
    fontWeight: '600',
  },
  modalButtonPrimary: {
    backgroundColor: '#B8A7E8',
  },
  modalButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonPrimaryText: {
    color: '#333',
    fontWeight: '700',
  },
});
