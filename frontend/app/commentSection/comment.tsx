import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { CommentNode } from './_utils';

type CommentProps = {
  comment: CommentNode;
  depth: number;
  onReply?: (comment: CommentNode) => void;
};

const INDENT_PER_LEVEL = 12;
const MAX_PREVIEW_CHARS = 280;

const Comment: React.FC<CommentProps> = ({ comment, depth, onReply }) => {
  const username = comment.UserProfile?.username ?? 'Anonymous';
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = comment.content.length > MAX_PREVIEW_CHARS;
  const previewText = isLong
    ? comment.content.slice(0, MAX_PREVIEW_CHARS).trimEnd() + '…'
    : comment.content;
  const displayText = isExpanded || !isLong ? comment.content : previewText;

  return (
    <View style={[styles.container, { marginLeft: depth * INDENT_PER_LEVEL }]}> 
      {/* Left thread bar */}
      {depth > 0 && <View style={styles.threadBar} />}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.username}>{username}</Text>
            {/* TODO: format createdAt → “2h ago” if you want */}
            <Text style={styles.timestamp}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <Text style={styles.body}>{displayText}</Text>

        {isLong && (
          <TouchableOpacity onPress={() => setIsExpanded((prev) => !prev)}>
            <Text style={styles.expandText}>
              {isExpanded ? 'Show less' : 'Expand comment'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => onReply?.(comment)}>
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          {/* Add more actions later: Like, More, etc. */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  threadBar: {
    width: 2,
    marginRight: 8,
    borderRadius: 1,
    backgroundColor: '#ddd',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerText: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  body: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  expandText: {
    marginTop: 4,
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    marginRight: 16,
  },
});

export default Comment;
