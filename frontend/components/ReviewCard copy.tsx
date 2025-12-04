import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { components } from '../types/api-generated';

type Rating = components['schemas']['Rating'];

type ReviewCardProps = {
  rating: Rating;
};

const ReviewCard: React.FC<ReviewCardProps> = ({ rating }) => {
  // Extracting user info — your logs often show nested UserProfile/User objects
  const userObj =
    (rating as any).user ||
    (rating as any).UserProfile ||
    (rating as any).userProfile ||
    null;

  const username: string =
    userObj?.username ||
    userObj?.name ||
    'Anonymous';

  const handle: string =
    userObj?.handle ||
    userObj?.username ||
    'user';

  const rawDate =
    (rating as any).date ||
    (rating as any).createdAt ||
    null;

  const dateLabel = rawDate
    ? new Date(rawDate as any).toLocaleDateString()
    : '';

  const content: string =
    (rating as any).comment ||
    (rating as any).reviewText ||
    '[NO REVIEW TEXT]';

  const stars = typeof rating.stars === 'number' ? rating.stars : 0;

  return (
    <View style={styles.container}>
      {/* Header with avatar + user info */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userHandle}>
            @{handle}
            {dateLabel ? ` • ${dateLabel}` : ''}
          </Text>
        </View>
      </View>

      {/* Actual review block */}
      <View style={styles.nestedReview}>
        <View style={styles.nestedHeader}>
          <View style={styles.smallAvatar} />
          <Text style={styles.nestedUserName}>{username}</Text>
        </View>

        {/* Review text */}
        <Text style={styles.reviewTitle}>{content}</Text>

        {/* Star rating */}
        <View style={styles.reviewStarsContainer}>
          {Array.from({ length: 5 }).map((_, idx) => {
            const starIndex = idx + 1;
            const filled = stars >= starIndex;
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

      {/* Action toolbar */}
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
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
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
  nestedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D3D3D3',
    marginRight: 8,
  },
  nestedUserName: {
    fontSize: 14,
    fontWeight: '600',
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
});
