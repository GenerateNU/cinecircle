import { useState } from "react";
import { CommentNode } from "./_utils";
import { View, TouchableOpacity, Text } from "react-native";
import Comment from "./comment";

interface CommentThreadProps {
    node: CommentNode;
    depth: number;
    onReply: (node: CommentNode) => void;
}

const INITIAL_VISIBLE_REPLIES = 3;

function CommentThread({ node, depth, onReply }: CommentThreadProps) {
  const [visibleReplies, setVisibleReplies] = useState(INITIAL_VISIBLE_REPLIES);

  const totalReplies = node.replies.length;
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
          style={{ marginLeft: (depth + 1) * 12, paddingVertical: 4 }}
        >
          <Text style={{ color: "#555", fontSize: 13 }}>
            View more replies ({totalReplies - visibleReplies} more)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default CommentThread;
