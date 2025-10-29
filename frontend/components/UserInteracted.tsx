import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart, Repeat2 } from 'lucide-react-native';

interface InteractionHeaderProps {
    username: string;
    interactionType: 'loved' | 'reposted'; // either loved or reposted (?)
    size?: 'small' | 'medium' | 'large';
}

export const InteractionHeader = ({
    username, // e.g. Rowen
    interactionType, // e.g. Loved
    size = 'medium'
  }: InteractionHeaderProps) => {
    // adjustable styles ? can be changed according to diff platforms
    const sizeConfig = {
      small: { iconSize: 14, fontSize: 12, spacing: 6 },
      medium: { iconSize: 16, fontSize: 14, spacing: 8 },
      large: { iconSize: 18, fontSize: 16, spacing: 10 }
    };

    const config = sizeConfig[size]; 
    const isLoved = interactionType === 'loved';

    return (
        <View style={[styles.container, { gap: config.spacing }]}>
          {isLoved ? (
            <Heart 
              size={config.iconSize} 
              color="#6B7280" 
              fill="#6B7280"
            />
          ) : (
            <Repeat2 
              size={config.iconSize} 
              color="#6B7280"
            />
          )}
          <Text style={[styles.text, { fontSize: config.fontSize }]}>
            {username} {isLoved ? 'loved' : 'reposted'}
          </Text>
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 4,
          paddingHorizontal: 8,
        },
        text: {
          color: '#6B7280',
          fontWeight: '500',
        },
      });


