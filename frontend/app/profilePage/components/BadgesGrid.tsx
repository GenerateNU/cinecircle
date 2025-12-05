import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

// Map badge slugs from backend to label + icon name
const BADGE_META: Record<
  string,
  { label: string; iconName: keyof typeof MaterialIcons.glyphMap; description?: string }
> = {
  welcome: {
    label: 'Welcome to CineCircle',
    iconName: 'emoji-events',
    description: 'Completed onboarding and joined the community.',
  },
  // later:
  // critic:  { label: 'Critic', iconName: 'rate-review' },
  // marathoner: { label: 'Marathoner', iconName: 'timer' },
};

type BadgesGridProps = {
  badgeSlugs?: string[];
};


const BadgesGrid: React.FC<BadgesGridProps> = ({ badgeSlugs = [] }) => {
const badges = badgeSlugs
    .map((slug) => {
      const meta = BADGE_META[slug];
      if (!meta) return null;
      return {
        id: slug,
        label: meta.label,
        iconName: meta.iconName,
        description: meta.description,
      };
    })
    .filter(Boolean) as {
      id: string;
      label: string;
      iconName: keyof typeof MaterialIcons.glyphMap;
      description?: string;
    }[];

  // No badges yet
  if (!badges.length) {
    return (
      <View style={tw`py-6 items-center`}>
        <Text style={tw`text-base font-semibold mb-1`}>No badges yet</Text>
        <Text style={tw`text-sm text-gray-500 text-center px-6`}>
          Start rating movies, posting, and completing activities to earn badges.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-row flex-wrap gap-3`}>
      {badges.map(b => (
        <View
          key={b.id}
          style={tw`items-center justify-center w-[30%] aspect-square rounded-xl border border-[#D62E05] bg-[#F7D5CD]`}
        >
          <View
            style={tw`w-12 h-12 rounded-full bg-[#D62E05] items-center justify-center mb-1.5`}
          >
            <MaterialIcons name={b.iconName} size={22} color="#F7D5CD" />
          </View>
          <Text
            style={tw`text-[12px] font-semibold text-center text-[#5c250e]`}
            numberOfLines={2}
          >
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BadgesGrid;
