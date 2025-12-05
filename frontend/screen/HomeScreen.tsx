import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';
import TabToggle from '../components/TabToggle';
import Carousel from '../components/Carousel';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import InteractionBar from '../components/InteractionBar';
import UserBar from '../components/UserBar';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

type Post = {
  id: string;
  type: 'text' | 'picture' | 'review';
  userName: string;
  username: string;
  date: string;
  content: string;
  imageUrls?: string[];
  movieTitle?: string;
  rating?: number;
  movieImageUrl?: string;
  userId?: string;
  reviewerName?: string;
  reviewerUserId?: string;
  commentCount?: number;
  reactions?: Array<{
    emoji: string;
    count: number;
    selected: boolean;
  }>;
};

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const heroHeight = Math.min(screenWidth * 0.6, 320);
  const heroHeightPercent = (heroHeight / screenHeight) * 100;
  const primaryNavColor = '#D62E05';
  const inactiveNavColor = '#979797';
  const navOptions = ['For You', 'Friends', 'Trending'];
  const navTabs = navOptions.map(label => ({ key: label, label }));

  const postsByTab: Record<string, Post[]> = {
    'For You': [
      {
        id: 'fy-1',
        type: 'review',
        userName: 'Arjun Kapoor',
        username: 'arjunk',
        date: '2h ago',
        content: 'Check out this new review that I just dropped!',
        reviewerName: 'Arjun Kapoor',
        reviewerUserId: 'user-1',
        movieTitle: 'RRR',
        rating: 5,
        movieImageUrl:
          'https://image.tmdb.org/t/p/original/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg',
        userId: 'user-1',
        commentCount: 24,
        reactions: [
          { emoji: '🌶️', count: 12, selected: false },
          { emoji: '✨', count: 18, selected: false },
          { emoji: '🧠', count: 8, selected: false },
          { emoji: '🧨', count: 45, selected: true },
        ],
      },
      {
        id: 'fy-2',
        type: 'text',
        userName: 'Priya Sharma',
        username: 'priyasharma',
        date: '3h ago',
        content:
          'Just watched 3 Idiots for the 10th time and it still makes me cry. Aamir Khan\'s performance is timeless. "All is well" will forever be iconic! 🎓',
        userId: 'user-2',
        commentCount: 15,
        reactions: [
          { emoji: '🌶️', count: 5, selected: false },
          { emoji: '✨', count: 23, selected: true },
          { emoji: '🧠', count: 17, selected: false },
          { emoji: '🧨', count: 9, selected: false },
        ],
      },
      {
        id: 'fy-3',
        type: 'picture',
        userName: 'Raj Malhotra',
        username: 'rajm',
        date: '5h ago',
        content:
          'Found this hidden gem of a theater in Mumbai that still shows classic Bollywood films. Caught a screening of Sholay last night - the experience was magical! 🎬',
        imageUrls: [
          'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        ],
        userId: 'user-3',
        commentCount: 8,
        reactions: [
          { emoji: '🌶️', count: 3, selected: false },
          { emoji: '✨', count: 12, selected: false },
          { emoji: '🧠', count: 4, selected: false },
          { emoji: '🧨', count: 6, selected: false },
        ],
      },
      {
        id: 'fy-4',
        type: 'review',
        userName: 'Kavya Reddy',
        username: 'kavyar',
        date: '6h ago',
        content: 'Check out this new review that I just dropped!',
        reviewerName: 'Kavya Reddy',
        reviewerUserId: 'user-4',
        movieTitle: 'Baahubali 2: The Conclusion',
        rating: 4.5,
        movieImageUrl:
          'https://image.tmdb.org/t/p/original/9oKwLM9XlhVGGNnKkOJ8ovjQ3cG.jpg',
        userId: 'user-4',
        commentCount: 32,
        reactions: [
          { emoji: '🌶️', count: 8, selected: false },
          { emoji: '✨', count: 28, selected: false },
          { emoji: '🧠', count: 12, selected: false },
          { emoji: '🧨', count: 56, selected: false },
        ],
      },
    ],
    Friends: [
      {
        id: 'fr-1',
        type: 'picture',
        userName: 'Aisha Khan',
        username: 'aishak',
        date: '1h ago',
        content:
          "Movie night with the squad! We're doing a Shahrukh Khan marathon - starting with Dilwale Dulhania Le Jayenge. Who else is a SRK fan? 👑",
        imageUrls: [
          'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1600&q=80',
        ],
        userId: 'user-5',
        commentCount: 11,
        reactions: [
          { emoji: '🌶️', count: 4, selected: false },
          { emoji: '✨', count: 19, selected: true },
          { emoji: '🧠', count: 2, selected: false },
          { emoji: '🧨', count: 7, selected: false },
        ],
      },
      {
        id: 'fr-2',
        type: 'text',
        userName: 'Vikram Singh',
        username: 'vikrams',
        date: '4h ago',
        content:
          "Andhadhun is a masterpiece! The way Sriram Raghavan keeps you guessing till the very end is brilliant. If you haven't seen it yet, what are you waiting for? 🎹",
        userId: 'user-6',
        commentCount: 21,
        reactions: [
          { emoji: '🌶️', count: 14, selected: false },
          { emoji: '✨', count: 8, selected: false },
          { emoji: '🧠', count: 31, selected: true },
          { emoji: '🧨', count: 5, selected: false },
        ],
      },
      {
        id: 'fr-3',
        type: 'review',
        userName: 'Meera Patel',
        username: 'meerap',
        date: '6h ago',
        content: 'Check out this new review that I just dropped!',
        reviewerName: 'Meera Patel',
        reviewerUserId: 'user-7',
        movieTitle: 'Dangal',
        rating: 5,
        movieImageUrl:
          'https://image.tmdb.org/t/p/original/9bCNo1FXwW9r1v9w5mYYxY8b5sO.jpg',
        userId: 'user-7',
        commentCount: 18,
        reactions: [
          { emoji: '🌶️', count: 6, selected: false },
          { emoji: '✨', count: 15, selected: false },
          { emoji: '🧠', count: 22, selected: false },
          { emoji: '🧨', count: 11, selected: false },
        ],
      },
    ],
    Trending: [
      {
        id: 'tr-1',
        type: 'text',
        userName: 'Bollywood Insider',
        username: 'bollyinsider',
        date: 'Just now',
        content:
          "Box office update: Jawan crosses ₹1000 crore worldwide! Shah Rukh Khan proves he's still the king! 👑💰",
        userId: 'user-8',
        commentCount: 67,
        reactions: [
          { emoji: '🌶️', count: 23, selected: false },
          { emoji: '✨', count: 45, selected: false },
          { emoji: '🧠', count: 12, selected: false },
          { emoji: '🧨', count: 89, selected: true },
        ],
      },
      {
        id: 'tr-2',
        type: 'picture',
        userName: 'Cinema Chronicles',
        username: 'cinemachronicles',
        date: '50m ago',
        content:
          'Behind the scenes from the Pathaan shoot! The action sequences were filmed across 8 countries. Indian cinema is truly going global! 🌍',
        imageUrls: [
          'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
        ],
        userId: 'user-9',
        commentCount: 43,
        reactions: [
          { emoji: '🌶️', count: 18, selected: false },
          { emoji: '✨', count: 52, selected: false },
          { emoji: '🧠', count: 9, selected: false },
          { emoji: '🧨', count: 71, selected: false },
        ],
      },
      {
        id: 'tr-3',
        type: 'review',
        userName: 'Rohan Verma',
        username: 'rohanv',
        date: '2h ago',
        content: 'Check out this new review that I just dropped!',
        reviewerName: 'Rohan Verma',
        reviewerUserId: 'user-10',
        movieTitle: 'Tumbbad',
        rating: 4.5,
        movieImageUrl:
          'https://image.tmdb.org/t/p/original/wDlMQdNQJqFn1pekaXGqxqC9pBg.jpg',
        userId: 'user-10',
        commentCount: 29,
        reactions: [
          { emoji: '🌶️', count: 31, selected: true },
          { emoji: '✨', count: 19, selected: false },
          { emoji: '🧠', count: 42, selected: false },
          { emoji: '🧨', count: 14, selected: false },
        ],
      },
    ],
  };

  const heroSlides = [
    {
      id: 'spider-verse',
      uri: 'https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
      title: 'Across the Spider-Verse',
      subtitle: 'Miles and Gwen swing across the multiverse.',
    },
    {
      id: 'dune-part-two',
      uri: 'https://image.tmdb.org/t/p/original/AtFG8L1Jf3GOMcxNnTvMXLfxJ9v.jpg',
      title: 'Dune: Part Two',
      subtitle: 'Paul and Chani stride through Arrakis dunes.',
    },
    {
      id: 'oppenheimer',
      uri: 'https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg',
      title: 'Oppenheimer',
      subtitle: 'The Trinity test ignites the desert horizon.',
    },
    {
      id: 'the-batman',
      uri: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
      title: 'The Batman',
      subtitle: 'Batman surveys Gotham from the skyline.',
    },
    {
      id: 'mad-max-fury-road',
      uri: 'https://image.tmdb.org/t/p/original/euYcyqv5J19t1SYwQ8d3tNbBlPR.jpg',
      title: 'Mad Max: Fury Road',
      subtitle: 'Furiosa leads the rig through the sandstorm.',
    },
    {
      id: 'la-la-land',
      uri: 'https://image.tmdb.org/t/p/original/wC4H1Z0YvSuFAvauGmDx5hOaP6F.jpg',
      title: 'La La Land',
      subtitle: 'Seb and Mia dance above the city lights.',
    },
    {
      id: 'everything-everywhere',
      uri: 'https://image.tmdb.org/t/p/original/s9Mqz1TQO2wy7h0T4z9NJ1ONwW3.jpg',
      title: 'Everything Everywhere All at Once',
      subtitle: 'Evelyn spirals through the multiverse.',
    },
    {
      id: 'wonder-woman',
      uri: 'https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
      title: 'Wonder Woman',
      subtitle: "Diana crosses No Man's Land.",
    },
  ];

  const [hiddenHeroIds, setHiddenHeroIds] = React.useState<Set<string>>(
    new Set()
  );
  const visibleHeroSlides = heroSlides.filter(
    slide => !hiddenHeroIds.has(slide.id)
  );
  const hideSlideOnError = (id: string) => {
    setHiddenHeroIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };
  const heroComponents = visibleHeroSlides.map(slide => (
    <ImageBackground
      source={{ uri: slide.uri }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
      onError={() => hideSlideOnError(slide.id)}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)']}
        style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}
      >
        <Text style={tw`text-white text-xl font-semibold mb-1`}>
          {slide.title}
        </Text>
        <Text style={tw`text-white text-sm`}>{slide.subtitle}</Text>
      </LinearGradient>
    </ImageBackground>
  ));

  const [activeNav, setActiveNav] = React.useState(navOptions[0]);

  const renderPost = (post: Post, index: number, totalPosts: number) => {
    if (post.type === 'review') {
      return (
        <React.Fragment key={post.id}>
          <View style={styles.reviewItemContainer}>
            <UserBar
              name={post.userName}
              username={post.username}
              userId={post.userId}
            />
            <Text style={styles.reviewShareText}>{post.content}</Text>
            <ReviewPost
              userName={post.reviewerName || post.userName}
              username={post.username}
              date={post.date}
              reviewerName={post.reviewerName || post.userName}
              movieTitle={post.movieTitle || ''}
              rating={post.rating || 0}
              userId={post.reviewerUserId || post.userId}
              reviewerUserId={post.reviewerUserId || post.userId}
              movieImageUrl={post.movieImageUrl || ''}
            />
          </View>
          {index < totalPosts - 1 && <View style={styles.divider} />}
        </React.Fragment>
      );
    } else if (post.type === 'picture') {
      return (
        <React.Fragment key={post.id}>
          <View style={styles.postContainer}>
            <PicturePost
              userName={post.userName}
              username={post.username}
              date={post.date}
              content={post.content}
              imageUrls={post.imageUrls || []}
              userId={post.userId}
            />
            <View style={styles.interactionWrapper}>
              <InteractionBar
                initialComments={post.commentCount || 0}
                reactions={post.reactions}
              />
            </View>
          </View>
          {index < totalPosts - 1 && <View style={styles.divider} />}
        </React.Fragment>
      );
    } else {
      // text post
      return (
        <React.Fragment key={post.id}>
          <View style={styles.postContainer}>
            <TextPost
              userName={post.userName}
              username={post.username}
              date={post.date}
              content={post.content}
              userId={post.userId}
            />
            <View style={styles.interactionWrapper}>
              <InteractionBar
                initialComments={post.commentCount || 0}
                reactions={post.reactions}
              />
            </View>
          </View>
          {index < totalPosts - 1 && <View style={styles.divider} />}
        </React.Fragment>
      );
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <SearchBar
        placeholder="Search posts..."
        onPress={() =>
          router.push({
            pathname: '/search',
            params: { origin: 'home', defaultCategory: 'posts' },
          })
        }
      />
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={[tw`pb-28`]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero carousel */}
        <View style={{ paddingBottom: 16 }}>
          <Carousel
            width={100}
            height={heroHeightPercent}
            components={heroComponents}
          />
        </View>

        {/* Category nav */}
        <TabToggle
          tabs={navTabs}
          activeTab={activeNav}
          onTabChange={setActiveNav}
          activeColor={primaryNavColor}
          inactiveColor={inactiveNavColor}
          indicatorColor={primaryNavColor}
          containerStyle={tw`px-5`}
        />

        {/* Feed area under nav */}
        <View style={tw`mt-6`}>
          <View style={{ backgroundColor: '#FFF' }}>
            {postsByTab[activeNav].map((post, index) =>
              renderPost(post, index, postsByTab[activeNav].length)
            )}
          </View>
        </View>

        {/* Optional: show who's signed in */}
        {!!user && (
          <Text style={tw`text-sm text-gray-500 mt-4 px-5`}>
            Signed in as {user.email}
          </Text>
        )}

        {/* Optional: sign out button */}
        {onSignOut && (
          <TouchableOpacity
            onPress={onSignOut}
            style={tw`mt-8 self-start px-4 py-2 rounded-xl bg-gray-200 ml-5`}
          >
            <Text style={tw`text-black`}>Sign out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
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
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 0,
  },
});
