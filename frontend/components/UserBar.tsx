import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type UserBarProps = {
  name: string;
  username?: string;
  date?: string;
  avatarUri?: string;
  avatarSize?: number;
  userId?: string;
  nameColor?: string;
  usernameColor?: string;
  dateColor?: string;
};

export default function UserBar({
  name,
  username,
  date,
  avatarUri,
  avatarSize = width * 0.1,
  userId,
  nameColor = '#000',
  usernameColor = '#666',
  dateColor = '#999',
}: UserBarProps) {
  const router = useRouter();

  const handlePress = () => {
    if (userId) {
      router.push(`/profilePage?userId=${userId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri:
            avatarUri ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=667eea&color=fff`,
        }}
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
      />
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={handlePress}
          disabled={!userId}
          activeOpacity={0.7}
        >
          <Text style={[styles.name, { color: nameColor }]}>{name}</Text>
        </TouchableOpacity>
        {username && (
          <Text style={[styles.username, { color: usernameColor }]}>
            @{username}
          </Text>
        )}
      </View>
      {date && <Text style={[styles.date, { color: dateColor }]}>{date}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    marginRight: width * 0.03,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  username: {
    fontSize: width * 0.035,
    marginTop: 2,
  },
  date: {
    fontSize: width * 0.035,
  },
});
