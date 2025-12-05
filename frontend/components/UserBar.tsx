// frontend/app/components/UserBar.tsx
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

// 👇 adjust this path to wherever you put the icon in your project
// e.g. ../assets/translate.png
const translateIcon = require('../assets/translate.png');

const { width } = Dimensions.get('window');

type UserBarProps = {
  name: string;
  username: string;
  date: string;
  avatarUri?: string;
  userId?: string;

  // NEW: translation-related props
  showTranslate?: boolean;
  onPressTranslate?: () => void;
  loadingTranslate?: boolean;
};

export default function UserBar({
  name,
  username,
  date,
  avatarUri,
  // userId not used visually here but you might use it for nav
  userId,
  showTranslate = false,
  onPressTranslate,
  loadingTranslate = false,
}: UserBarProps) {
  return (
    <View style={styles.container}>
      {/* Left: avatar */}
      <View style={styles.leftRow}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}

        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
        </View>
      </View>

      {/* Right: translate icon + date */}
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

        <Text style={styles.date}>{date}</Text>
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
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
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
