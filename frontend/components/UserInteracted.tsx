import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InteractionHeaderProps {
    username: string;
    interactionType: 'loved' | 'reposted';
    size?: 'small' | 'medium' | 'large';
}

export const InteractionHeader = ({
    username,
    interactionType,
    size = 'medium'
  }: InteractionHeaderProps) => {
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
            <Feather 
              name="heart" 
              size={config.iconSize} 
              color="#6B7280" 
            />
          ) : (
            <Feather 
              name="repeat" 
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