import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';

const { width } = Dimensions.get('window');

type TextPostProps = {
  userName: string;
  username: string;
  date: string;
  avatarUri?: string;
  content: string;
  userId?: string;
  /** If true, show a 'Spoiler' badge on the card */
  spoiler?: boolean;
};

export default function TextPost({
  userName,
  username,
  date,
  avatarUri,
  content,
  userId,
  spoiler = false,
}: TextPostProps) {
  return (
    <View style={styles.container}>
      {/* Top-right spoiler pill */}
      {spoiler && (
        <View style={styles.spoilerPill}>
          <Text style={styles.spoilerText}>Spoiler</Text>
        </View>
      )}

      <UserBar
        name={userName}
        username={username}
        date={date}
        avatarUri={avatarUri}
        userId={userId}
      />
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    width: '100%',
    position: 'relative',
  },
  content: {
    fontSize: width * 0.0375,
    color: '#000',
    lineHeight: width * 0.05,
    marginTop: width * 0.03,
    flexShrink: 1,
  },
  spoilerPill: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.035,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderColor: '#F5C518',
    zIndex: 2,
  },
  spoilerText: {
    color: '#F5C518',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
