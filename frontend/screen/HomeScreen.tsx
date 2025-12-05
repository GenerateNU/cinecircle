import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from '../components/SearchBar';
import TabToggle from '../components/TabToggle';
import SectionHeader from '../components/SectionHeader';
import Carousel from '../components/Carousel';

export type HomeScreenProps = {
  user?: any;
  onSignOut?: () => Promise<void>;
};

export default function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const heroHeight = Math.min(screenWidth * 0.6, 320);
  const heroHeightPercent = (heroHeight / screenHeight) * 100;
  const primaryNavColor = '#D62E05';
  const inactiveNavColor = '#979797';
  const navOptions = ['For You', 'Friends', 'Trending'];
  const navTabs = navOptions.map(label => ({ key: label, label }));
  const postsByTab: Record<
    string,
    {
      id: string;
      userName: string;
      username: string;
      date: string;
      content: string;
      imageUri?: string;
    }[]
  > = {
    'For You': [
      {
        id: 'fy-1',
        userName: 'Lena Morales',
        username: 'lenam',
        date: '2h ago',
        content:
          'Caught a surprise Q&A with the director last night—this shot of the neon skyline was unreal.',
        imageUri:
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'fy-2',
        userName: 'Khalid Noor',
        username: 'knoor',
        date: '3h ago',
        content:
          'If you loved slow-burn thrillers, add “North Passage” to your list. No jumpscares—just dread.',
      },
      {
        id: 'fy-3',
        userName: 'Ava Chen',
        username: 'ava.chen',
        date: '5h ago',
        content:
          'Festival reminder: short docs block starts at 7pm. Best seat is back row, right of center.',
        imageUri:
          'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1600&q=80',
      },
    ],
    Friends: [
      {
        id: 'fr-1',
        userName: 'Miguel Soto',
        username: 'migs',
        date: '1h ago',
        content:
          'Double-feature night: classic noir then animated short. Snacks ready, lights off.',
        imageUri:
          'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'fr-2',
        userName: 'Priya Patel',
        username: 'priyap',
        date: '4h ago',
        content:
          'Posted my review of “Riverlights.” Score’s great but the third act needed another pass.',
      },
      {
        id: 'fr-3',
        userName: 'Jonas Meyer',
        username: 'jonas.m',
        date: '6h ago',
        content:
          'Anyone heading to the rooftop screening tomorrow? I’ve got two extra tickets.',
      },
    ],
    Trending: [
      {
        id: 'tr-1',
        userName: 'Spotlight Daily',
        username: 'spotlight',
        date: 'Just now',
        content:
          'Box office watch: “Starfall” just crossed the $150M mark domestically.',
      },
      {
        id: 'tr-2',
        userName: 'Festival Lens',
        username: 'festivalens',
        date: '50m ago',
        content:
          'This candid from the Venice premiere is everywhere for a reason.',
        imageUri:
          'https://images.unsplash.com/photo-1520699514109-9012a284e1d9?auto=format&fit=crop&w=1600&q=80',
      },
      {
        id: 'tr-3',
        userName: 'Cinema Beat',
        username: 'cinemabeat',
        date: '2h ago',
        content:
          'Editor’s pick: five micro-budget films that punch way above their weight.',
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
      subtitle: 'Diana crosses No Man’s Land.',
    },
  ];
  const [hiddenHeroIds, setHiddenHeroIds] = React.useState<Set<string>>(new Set());
  const visibleHeroSlides = heroSlides.filter(slide => !hiddenHeroIds.has(slide.id));
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
        <Text style={tw`text-white text-xl font-semibold mb-1`}>{slide.title}</Text>
        <Text style={tw`text-white text-sm`}>{slide.subtitle}</Text>
      </LinearGradient>
    </ImageBackground>
  ));
  const quickActionButtons = [
    {
      label: 'Browse Movies',
      icon: <Feather name="film" size={18} color="#FFF" />,
      onPress: () => router.push('movies'),
    },
    {
      label: 'Find Events',
      icon: <Feather name="map-pin" size={18} color="#FFF" />,
      onPress: () => router.push('events'),
    },
    {
      label: 'Profile',
      icon: <Feather name="user" size={18} color="#FFF" />,
      onPress: () => router.push('profile'),
    },
  ];
  const [activeNav, setActiveNav] = React.useState(navOptions[0]);

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
        <View style={tw`mt-6 px-5`}>
          <View style={{ marginTop: 0 }}>
            {postsByTab[activeNav].map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarInitials}>
                        {post.userName
                          .split(' ')
                          .map(part => part[0])
                          .join('')
                          .slice(0, 2)}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.author}>{post.userName}</Text>
                      <Text style={styles.metaText}>@{post.username} · {post.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.postText}>{post.content}</Text>
                {post.imageUri && (
                  <Image
                    source={{ uri: post.imageUri }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))}
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

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontWeight: '700',
    color: '#D62E05',
  },
  author: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  postText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
});
