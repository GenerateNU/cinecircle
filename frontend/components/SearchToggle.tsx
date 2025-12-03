import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type SearchToggleProps<T extends string> = {
  options: Array<{
    value: T;
    label: string;
  }>;
  activeOption: T;
  onOptionChange: (option: T) => void;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  textActiveColor?: string;
  textInactiveColor?: string;
};

export default function SearchToggle<T extends string>({
  options,
  activeOption,
  onOptionChange,
  activeColor = '#f03535ff', 
  inactiveColor = 'transparent',
  backgroundColor = '#f8d9d9ff',
  textActiveColor = '#FFF',
  textInactiveColor = '#f03535ff',
}: SearchToggleProps<T>) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {options.map((option) => {
        const isActive = activeOption === option.value;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: isActive ? activeColor : inactiveColor,
              },
            ]}
            onPress={() => onOptionChange(option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: isActive ? textActiveColor : textInactiveColor,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: width * 0.03,
    padding: width * 0.01,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width * 0.02,
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.005,
  },
  optionText: {
    fontSize: width * 0.035,
    fontWeight: '600',
  },
});