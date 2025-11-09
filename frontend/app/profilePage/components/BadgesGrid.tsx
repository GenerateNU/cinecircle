import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const BadgesGrid = () => {
  const badges = [
    { id: 'b1', label: 'Critic', icon: <MaterialIcons name="rate-review" size={20} /> },
    { id: 'b2', label: 'Marathoner', icon: <MaterialIcons name="timer" size={20} /> },
    { id: 'b3', label: 'Blockbuster', icon: <MaterialIcons name="local-movies" size={20} /> },
    { id: 'b4', label: 'Butter Popcorn', icon: <MaterialIcons name="local-play" size={20} /> },
    { id: 'b5', label: 'Indie Lover', icon: <MaterialIcons name="theaters" size={20} /> },
    { id: 'b6', label: 'Festival Goer', icon: <MaterialIcons name="festival" size={20} /> },
  ];
  return (
    <View style={tw`flex-row flex-wrap gap-3`}>
      {badges.map((b) => (
        <View key={b.id} style={tw`w-[30%] aspect-square items-center justify-center rounded-[10px] border border-[#e5e5e5] bg-white`}>
          <View style={tw`mb-1.5`}>{b.icon}</View>
          <Text style={tw`text-[12px] font-semibold text-center`}>{b.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default BadgesGrid;

