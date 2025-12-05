// components/UserBar.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ⬇️ adjust if your icon lives somewhere else
const translateIcon = require('../assets/translate.png');

export type UserBarProps = {
  name: string;
  username?: string;
  date?: string;
  avatarUri?: string;
  userId?: string;

  // old props used by ReviewPost
  avatarSize?: number; // in px
  nameColor?: string;

  // new translation props
  showTranslate?: boolean;
  onPressTranslate?: () => void;
  loadingTranslate?: boolean;
};

export default function UserBar({
  name,
  username,
  date,
  avatarUri,
  userId, // not used visually yet, but kept for navigation if you want
  avatarSize,
  nameColor,
  showTranslate = false,
  onPressTranslate,
  loadingTranslate = false,
}: UserBarProps) {
  // default avatar size if not provided
  const size = avatarSize ?? width * 0.1;

  return (
    <View style={styles.container}>
      {/* Left: avatar + name/username */}
      <View style={styles.leftRow}>
        {avatarUri ? (
          <Image
            source={{ uri: avatarUri }}
            style={[
              styles.avatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              styles.avatarPlaceholder,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        )}

        <View>
          <Text style={[styles.name, nameColor ? { color: nameColor } : null]}>
            {name}
          </Text>
          {username ? <Text style={styles.username}>@{username}</Text> : null}
        </View>
      </View>

      {/* Right: translate icon (optional) + date (optional) */}
      <View style={styles.rightRow}>
        {showTranslate && (
          <TouchableOpacity
            onPress={onPressTranslate}
            disabled={loadingTranslate}
            style={styles.translateButton}
          >
            {loadingTranslate ? (
              <ActivityIndicator size="small" />
            ) : (
              <Image source={translateIcon} style={styles.translateIcon} />
            )}
          </TouchableOpacity>
        )}

        {date ? <Text style={styles.date}>{date}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    marginRight: width * 0.03,
  },
  avatarPlaceholder: {
    backgroundColor: '#DDD',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000',
  },
  username: {
    fontSize: width * 0.032,
    color: '#666',
  },
  date: {
    fontSize: width * 0.032,
    color: '#888',
  },
  translateButton: {
    marginRight: 4,
  },
  translateIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
