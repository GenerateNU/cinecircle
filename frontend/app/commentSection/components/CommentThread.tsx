import { useState } from "react";
import { CommentNode } from "../_utils";
import { View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import Comment from "./comment";
import { commentThreadStyles } from "../styles/CommentThread.styles";

interface CommentThreadProps {
  node: CommentNode;
  depth: number;
  onReply: (node: CommentNode) => void;
}

const INITIAL_VISIBLE_REPLIES = 4;
const MAX_DEPTH = 1; // only render one level of replies under each root

function CommentThread({ node, depth, onReply }: CommentThreadProps) {
  const totalReplies = node.replies.length;
  const isAtMaxDepth = depth >= MAX_DEPTH;

  // At max depth: render the comment itself and, if it has deeper replies,
  // show a "View conversation" link that navigates to a dedicated page.
  if (isAtMaxDepth) {
    return (
      <View>
        <Comment comment={node} depth={depth} onReply={onReply} />

        {totalReplies > 0 && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/commentSection/thread",
                params: { commentId: node.id },
              })
            }
            style={[commentThreadStyles.viewMoreButton, { marginLeft: (depth + 1) * 12 }]}
          >
            <Text style={commentThreadStyles.viewMoreText}>
              View full conversation ({totalReplies} replies)
            </Text>
          </TouchableOpacity>
        )}
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
        />
      ))}

      {hasMoreReplies && (
        <TouchableOpacity
          onPress={() => setVisibleReplies(totalReplies)}
          style={[commentThreadStyles.viewMoreButton, { marginLeft: (depth + 1) * 12 }]}
        >
          <Text style={commentThreadStyles.viewMoreText}>
            View more replies ({totalReplies - visibleReplies} more)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CommentThread;
