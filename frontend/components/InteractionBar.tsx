import { useState } from 'react';
import { View } from 'react-native';
import ReactionButton from './ReactionButton';
import CommentButton from './CommentButton';
import { styles } from '../styles/InteractionBar.styles';

type Reaction = {
  emoji: string;
  count: number;
  selected: boolean;
};

interface InteractionBarProps {
  initialComments?: number;
  onCommentPress?: () => void;
  reactions?: Reaction[];
  onReactionPress?: (index: number) => void;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { emoji: '🌶️', count: 0, selected: false }, // SPICY - Drama-filled, bold
  { emoji: '✨', count: 0, selected: false }, // STAR_STUDDED - Packed with A-listers
  { emoji: '🧠', count: 0, selected: false }, // THOUGHT_PROVOKING - Mind blowing
  { emoji: '🧨', count: 0, selected: false }, // BLOCKBUSTER - Mega-hit with hype
];

export default function InteractionBar({
  initialComments = 0,
  onCommentPress,
  reactions = DEFAULT_REACTIONS,
  onReactionPress,
}: InteractionBarProps) {
  const [localReactions, setLocalReactions] = useState(DEFAULT_REACTIONS);

  // Use prop reactions if handler provided, otherwise use local state
  const displayReactions = onReactionPress ? reactions : localReactions;

  const handleReactionPress = (index: number) => {
    if (onReactionPress) {
      onReactionPress(index);
    } else {
      // Local state management
      setLocalReactions(prev => {
        const newStates = [...prev];
        const reaction = { ...newStates[index] };
        reaction.selected = !reaction.selected;
        reaction.count = reaction.selected
          ? reaction.count + 1
          : Math.max(0, reaction.count - 1);
        newStates[index] = reaction;
        return newStates;
      });
    }
  };

  return (
    <View style={styles.container}>
      <CommentButton count={initialComments} onPress={onCommentPress} />

      <View style={styles.reactionsContainer}>
        {displayReactions.map((reaction, index) => (
          <ReactionButton
            key={index}
            emoji={reaction.emoji}
            count={reaction.count}
            selected={reaction.selected}
            onPress={() => handleReactionPress(index)}
          />
        ))}
      </View>
    </View>
  );
}
