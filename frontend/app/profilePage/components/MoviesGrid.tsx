import React from 'react';
import { View, Image, FlatList, Dimensions } from 'react-native';
import tw from 'twrnc';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MoviesGrid = () => {
  const posters = [
    'https://image.tmdb.org/t/p/w185/9O1Iy9od7VwG9N0e6N4l1EuY1r8.jpg',
    'https://image.tmdb.org/t/p/w185/6bCplVkhowCjTHXWv49UjRPn0eK.jpg',
    'https://image.tmdb.org/t/p/w185/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    'https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://image.tmdb.org/t/p/w185/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    'https://image.tmdb.org/t/p/w185/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  ];
  const itemWidth = (SCREEN_WIDTH - 16 * 2 - 8 * 2) / 3; // padding & gaps
  return (
    <View style={tw`mb-4`}>
      <FlatList
        data={posters}
        keyExtractor={(uri, idx) => uri + idx}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={[tw`h-40 rounded-[6px] mb-2`, { width: itemWidth }]} />
        )}
      />
    </View>
  );
};

export default MoviesGrid;

