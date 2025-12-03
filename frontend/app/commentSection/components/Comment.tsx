import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { CommentNode } from '../_utils';
import CommentUserRow from './CommentUserRow';
import { commentStyles, INDENT_PER_LEVEL } from '../styles/Comment.styles';

type CommentProps = {
  comment: CommentNode;
  depth: number;
  onReply?: (comment: CommentNode) => void;
};

const MAX_PREVIEW_CHARS = 280;

const Comment: React.FC<CommentProps> = ({ comment, depth, onReply }) => {
  const username = comment.UserProfile?.username ?? 'Anonymous';
  const profilePicture = comment.UserProfile?.profilePicture ?? null;
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = comment.content.length > MAX_PREVIEW_CHARS;
  const previewText = isLong
    ? comment.content.slice(0, MAX_PREVIEW_CHARS).trimEnd() + '…'
    : comment.content;
  const displayText = isExpanded || !isLong ? comment.content : previewText;

  return (
    <View style={[commentStyles.container, { marginLeft: depth * INDENT_PER_LEVEL }]}> 
      {/* Left thread bar */}
      {depth > 0 && <View style={commentStyles.threadBar} />}

      <View style={commentStyles.content}>
        <View style={commentStyles.headerRow}>
          <CommentUserRow
            username={username}
            profilePicture={profilePicture}
            timestamp={comment.createdAt}
          />
        </View>

        <Text style={commentStyles.body}>{displayText}</Text>

        {isLong && (
          <TouchableOpacity onPress={() => setIsExpanded((prev) => !prev)}>
            <Text style={commentStyles.expandText}>
              {isExpanded ? 'Show less' : 'Expand comment'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={commentStyles.actionsRow}>
          <TouchableOpacity onPress={() => onReply?.(comment)}>
            <Text style={commentStyles.actionText}>Reply</Text>
          </TouchableOpacity>
          {/* Add more actions later: Like, More, etc. */}
        </View>
      </View>
    </View>
  );
};

export default Comment;
