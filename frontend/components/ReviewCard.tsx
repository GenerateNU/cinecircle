import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { components } from '../types/api-generated';

type Rating = components['schemas']['Rating'];

type ReviewCardProps = {
  rating: Rating;
  hideSpoilersForUser: boolean;
};

export default function ReviewCard({ rating, hideSpoilersForUser }: ReviewCardProps) {
  const [revealed, setRevealed] = useState(false);

  const isSpoiler = Boolean((rating as any).spoiler);
  const shouldCover = hideSpoilersForUser && isSpoiler && !revealed;

  const createdAt =
    (rating as any).date || (rating as any).createdAt || null;
  const createdAtLabel = createdAt
    ? new Date(createdAt as any).toLocaleDateString()
    : '';

  const content = (rating as any).comment || '[NO REVIEW TEXT]';

  return (
    <View style={styles.container}>
      {/* MAIN CARD CONTENT */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Anonymous</Text>
          <Text style={styles.userHandle}>
            @user {createdAtLabel ? `• ${createdAtLabel}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.nestedReview}>
        <Text style={styles.reviewTitle}>{content}</Text>

        <View style={styles.reviewStarsContainer}>
          {Array.from({ length: 5 }).map((_, idx) => {
            const starIndex = idx + 1;
            const filled = rating.stars >= starIndex;
            return (
              <Text
                key={starIndex}
                style={[styles.reviewStar, !filled && { opacity: 0.3 }]}
              >
                ★
              </Text>
            );
          })}
          <TouchableOpacity style={styles.bookmarkIcon}>
            <Text>🔖</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>❤️ 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>💬 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>🔁 0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>↗️</Text>
        </TouchableOpacity>
      </View>

      {/* SPOILER OVERLAY */}
      {shouldCover && (
        <View style={styles.spoilerOverlay}>
          <Text style={styles.spoilerTitle}>⚠️ Spoiler warning</Text>
          <Text style={styles.spoilerText}>
            This review contains spoilers.
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
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // needed so overlay can sit on top
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D3D3D3',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  userHandle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  nestedReview: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStar: {
    fontSize: 18,
    color: '#000',
    marginRight: 2,
  },
  bookmarkIcon: {
    marginLeft: 'auto',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },

  // SPOILER OVERLAY STYLES
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
