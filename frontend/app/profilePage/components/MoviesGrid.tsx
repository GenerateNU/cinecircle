import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

type MovieListItem = {
  id: string;
  title: string;
  poster: string;
};

const MOVIE_LISTS: Record<'toWatch' | 'completed', MovieListItem[]> = {
  toWatch: [
    {
      id: 'tbw-1',
      title: 'Dune: Part Two',
      poster: 'https://image.tmdb.org/t/p/w185/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    },
    {
      id: 'tbw-2',
      title: 'Civil War',
      poster: 'https://image.tmdb.org/t/p/w185/j3Z3XktmWB1VhsS8iXNcrR86PXi.jpg',
    },
    {
      id: 'tbw-3',
      title: 'Wicked',
      poster: 'https://image.tmdb.org/t/p/w185/gXjhF4JT8V0SZOZQGyVXzlL0A1B.jpg',
    },
  ],
  completed: [
    {
      id: 'cmp-1',
      title: 'Oppenheimer',
      poster: 'https://image.tmdb.org/t/p/w185/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg',
    },
    {
      id: 'cmp-2',
      title: 'Past Lives',
      poster: 'https://image.tmdb.org/t/p/w185/kCrqYmLXU1q8Z2kuxSVt8nZdyk2.jpg',
    },
    {
      id: 'cmp-3',
      title: 'The Holdovers',
      poster: 'https://image.tmdb.org/t/p/w185/dPuEkT9U097JmMHbBOcSWmlu0Pb.jpg',
    },
  ],
};

const MoviesGrid = () => {
  const [activeSubTab, setActiveSubTab] = useState<'toWatch' | 'completed'>('toWatch');
  const movies = MOVIE_LISTS[activeSubTab];
  const showBookmark = activeSubTab === 'toWatch';

  const renderMovie = ({ item }: { item: MovieListItem }) => (
    <View style={tw`flex-row items-center py-3 border-b border-gray-100`}>
      <Image
        source={{ uri: item.poster }}
        style={tw`w-[56px] h-[84px] rounded-md`}
        resizeMode="cover"
      />
      <Text style={tw`flex-1 ml-4 text-base font-semibold text-black`} numberOfLines={2}>
        {item.title}
      </Text>
      <Ionicons
        name={showBookmark ? 'bookmark-outline' : 'checkmark-circle-outline'}
        size={22}
        color="#111"
      />
    </View>
  );

  return (
    <View>
      <View
        style={[
          tw`flex-row items-center mb-4`,
          {
            backgroundColor: '#FBEAE6',
            borderRadius: 12,
            padding: 4,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor: activeSubTab === 'toWatch' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('toWatch')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'toWatch' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            To Be Watched
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`flex-1 items-center justify-center`,
            {
              paddingVertical: 8,
              borderRadius: 8,
              marginHorizontal: 2,
              backgroundColor: activeSubTab === 'completed' ? '#D62E05' : 'transparent',
            },
          ]}
          onPress={() => setActiveSubTab('completed')}
        >
          <Text
            style={[
              tw`text-sm font-semibold`,
              { color: activeSubTab === 'completed' ? '#FBEAE6' : '#D62E05' },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={renderMovie}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={tw`h-0`} />}
      />
    </View>
  );
};

export default MoviesGrid;
