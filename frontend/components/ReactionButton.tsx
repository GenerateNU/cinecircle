import { TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/ReactionButton.styles';

interface ReactionButtonProps {
  emoji: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}

export default function ReactionButton({
  emoji,
  count,
  selected,
  onPress,
}: ReactionButtonProps) {
  if (selected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <LinearGradient
          colors={['#FFF8F7', '#FFCCC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.reactionButtonSelected}
        >
          <Text style={styles.reactionEmoji}>{emoji}</Text>
          <Text
            style={[styles.reactionCount, selected && styles.selectedCount]}
          >
            {String(count)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.reactionButton}>
        <Text style={styles.reactionEmoji}>{emoji}</Text>
        <Text style={styles.reactionCount}>{String(count)}</Text> 
      </View>
    </TouchableOpacity>
  );
}