import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/SectionHeader.styles';

interface SectionHeaderProps {
  title: string;
  showSearchIcon?: boolean;
  onSearchPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function SectionHeader({ 
  title, 
  showSearchIcon = false, 
  onSearchPress,
  size = 'medium' 
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, styles[size]]}>
      <Text style={[styles.title, styles[`${size}Title`]]}>{title}</Text>
      {showSearchIcon && (
        <TouchableOpacity onPress={onSearchPress}>
          <Text style={[styles.searchIcon, styles[`${size}Icon`]]}>🔍</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}