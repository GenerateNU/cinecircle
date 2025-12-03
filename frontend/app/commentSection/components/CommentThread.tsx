import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CommentNode } from '../_utils';
import Comment from './Comment';
import { commentThreadStyles } from '../styles/CommentThread.styles';

interface CommentThreadProps {
  node: CommentNode;
  depth: number;
  onReply: (node: CommentNode) => void;
  targetType: 'post' | 'rating';
  targetId: string;
}

const INITIAL_VISIBLE_REPLIES = 4;
const MAX_DEPTH = 1; // only render one level of replies under each root

function CommentThread({ node, depth, onReply, targetType, targetId }: CommentThreadProps) {
  const totalReplies = node.replies.length;
  const isAtMaxDepth = depth >= MAX_DEPTH;
  const shouldShowContinueThread = depth === 1 && totalReplies > 0;

  const handleContinueThread = () => {
    router.push({
      pathname: '/commentSection/thread',
      params: {
        type: targetType,
        targetId,
        commentId: node.id,
      },
    });
  };

  // At max depth: render the comment itself and, if it has deeper replies,
  // show a "Continue Thread" link that navigates to the dedicated page.
  if (isAtMaxDepth) {
    return (
      <View>
        <Comment
          comment={node}
          depth={depth}
          onReply={onReply}
          onContinueThread={shouldShowContinueThread ? handleContinueThread : undefined}
        />
      </View>
    );
  }

  // Depth 0: render up to four immediate replies with a "view more" expander.
  const [visibleReplies, setVisibleReplies] = useState(INITIAL_VISIBLE_REPLIES);
  const repliesToRender = node.replies.slice(0, visibleReplies);
  const hasMoreReplies = totalReplies > visibleReplies;

  return (
    <View>
      <Comment comment={node} depth={depth} onReply={onReply} />

      {repliesToRender.map((child) => (
        <CommentThread
          key={child.id}
          node={child}
          depth={depth + 1}
          onReply={onReply}
          targetType={targetType}
          targetId={targetId}
        />
      ))}

      {hasMoreReplies && (
        <TouchableOpacity
          onPress={() => setVisibleReplies(totalReplies)}
          style={[commentThreadStyles.viewMoreButton, { marginLeft: (depth + 1) * 12 }]}
        >
          {/* This is for showing *more siblings* at depth 1, not the nested page */}
          {/* You can keep it as-is or remove if you only want Continue Thread */}
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CommentThread;