import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const BadgesGrid = () => {
  const badges = [
    { id: 'b1', label: 'Critic', icon: 'rate-review' },
    { id: 'b2', label: 'Marathoner', icon: 'timer' },
    { id: 'b3', label: 'Blockbuster', icon: 'local-movies' },
    { id: 'b4', label: 'Butter Popcorn', icon: 'local-play' },
    { id: 'b5', label: 'Indie Lover', icon: 'theaters' },
    { id: 'b6', label: 'Festival Goer', icon: 'festival' },
  ];
  return (
    <View style={tw`flex-row flex-wrap gap-3`}>
      {badges.map((b) => (
        <View
          key={b.id}
          style={tw`items-center justify-center w-[30%] aspect-square rounded-xl border border-[#D62E05] bg-[#F7D5CD]`}
        >
          <View style={tw`w-12 h-12 rounded-full bg-[#D62E05] items-center justify-center mb-1.5`}>
            <MaterialIcons name={b.icon as any} size={22} color="#F7D5CD" />
          </View>
          <Text style={tw`text-[12px] font-semibold text-center text-[#5c250e]`}>
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BadgesGrid;
