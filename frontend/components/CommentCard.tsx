import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { components } from '../types/api-generated';

type Comment = components['schemas']['Comment'];

type CommentCardProps = {
  comment: Comment;
  hideSpoilersForUser: boolean;
};

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  hideSpoilersForUser,
}) => {
  const [revealed, setRevealed] = useState(false);

  const isSpoiler = Boolean((comment as any).spoiler);
  const shouldCover = hideSpoilersForUser && isSpoiler && !revealed;

  let createdAtLabel = '';
  try {
    const rawCreatedAt = (comment as any).createdAt;
    if (rawCreatedAt) {
      createdAtLabel = new Date(rawCreatedAt as any).toLocaleDateString();
    }
  } catch {}

  const content =
    (comment as any).content ||
    (comment as any).text ||
    '[NO COMMENT CONTENT]';

  return (
    <View style={styles.commentCard}>
      <Text style={styles.commentText}>{content}</Text>
      {!!createdAtLabel && (
        <Text style={styles.commentMeta}>{createdAtLabel}</Text>
      )}

      {shouldCover && (
        <View style={styles.spoilerOverlay}>
          <Text style={styles.spoilerTitle}>⚠️ Spoiler warning</Text>
          <Text style={styles.spoilerText}>
            This comment contains spoilers.
          </Text>
          <TouchableOpacity
            style={styles.spoilerButton}
            onPress={() => setRevealed(true)}
          >
            <Text style={styles.spoilerButtonText}>OK, show it</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  commentText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  commentMeta: {
    fontSize: 12,
    color: '#555',
  },

  // overlay
  spoilerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spoilerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  spoilerText: {
    fontSize: 14,
    color: '#EEE',
    marginBottom: 16,
    textAlign: 'center',
  },
  spoilerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  spoilerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});

export default CommentCard;
