import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from '../styles/Rsvp.styles';

type RsvpOption = 'yes' | 'maybe' | 'no' | null;

interface RsvpProps {
  eventId?: string;
  onContinue?: (response: RsvpOption) => void;
}

export default function Rsvp({ eventId, onContinue }: RsvpProps) {
  const [selectedOption, setSelectedOption] = useState<RsvpOption>(null);

  const handleOptionPress = (option: RsvpOption) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedOption);
    }
    console.log('RSVP Response:', selectedOption);
  };

  const isSelected = (option: RsvpOption) => selectedOption === option;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <View style={styles.registerSection}>
          <Text style={styles.registerTitle}>Register</Text>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionCard,
                isSelected('yes') && styles.optionCardSelected
              ]}
              onPress={() => handleOptionPress('yes')}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>🎉</Text>
              <Text style={[
                styles.optionText,
                isSelected('yes') && styles.optionTextSelected
              ]}>
                YES!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                isSelected('maybe') && styles.optionCardSelected
              ]}
              onPress={() => handleOptionPress('maybe')}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>🫥</Text>
              <Text style={[
                styles.optionText,
                isSelected('maybe') && styles.optionTextSelected
              ]}>
                Maybe
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                isSelected('no') && styles.optionCardSelected
              ]}
              onPress={() => handleOptionPress('no')}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>❌</Text>
              <Text style={[
                styles.optionText,
                isSelected('no') && styles.optionTextSelected
              ]}>
                No
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedOption && styles.continueButtonActive
            ]}
            onPress={handleContinue}
            disabled={!selectedOption}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.continueText,
              selectedOption && styles.continueTextActive
            ]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}