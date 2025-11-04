import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/InteractionBar.styles"

interface InteractionBarProps {
  initialLikes?: number;
  initialComments?: number;
  isLiked?: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
}

export default function InteractionBar({ 
  initialLikes = 0, 
  initialComments = 0,
  isLiked = false,
  onLikePress,
  onCommentPress
}: InteractionBarProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const isLikeInteractive = onLikePress !== undefined;
  const isCommentInteractive = onCommentPress !== undefined;

  const handleLikePress = () => {
    if (!isLikeInteractive) return;
    
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLikePress();
  };

  const handleCommentPress = () => {
    if (!isCommentInteractive) return;
    onCommentPress();
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(2) + "k";
    }
    return count.toString();
  };

  const LikeContainer = isLikeInteractive ? TouchableOpacity : View;
  const CommentContainer = isCommentInteractive ? TouchableOpacity : View;

  return (
    <View style={styles.container}>
      <LikeContainer 
        style={styles.button} 
        onPress={isLikeInteractive ? handleLikePress : undefined}
        activeOpacity={isLikeInteractive ? 0.7 : 1}
      >
        <MaterialIcons
          name="favorite"
          style={liked ? styles.likedIcon : styles.icon}
        />
        <Text style={styles.count}>{formatCount(likeCount)}</Text>
      </LikeContainer>

      <CommentContainer 
        style={styles.button} 
        onPress={isCommentInteractive ? handleCommentPress : undefined}
        activeOpacity={isCommentInteractive ? 0.7 : 1}
      >
        <MaterialIcons
          name="chat-bubble"
          style={styles.icon}
        />
        <Text style={styles.count}>{formatCount(initialComments)}</Text>
      </CommentContainer>
    </View>
  );
}
