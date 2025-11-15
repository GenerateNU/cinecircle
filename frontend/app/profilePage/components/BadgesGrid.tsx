import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const BadgesGrid = () => {
  const ACCENT = '#D62E05';
  const ACCENT_LIGHT = '#F7D5CD';
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
          style={[
            tw`items-center justify-center`,
            {
              width: '30%',
              aspectRatio: 1,
              borderRadius: 12,
              borderColor: ACCENT,
              backgroundColor: ACCENT_LIGHT,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: ACCENT,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}
          >
            <MaterialIcons name={b.icon as any} size={22} color={ACCENT_LIGHT} />
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
