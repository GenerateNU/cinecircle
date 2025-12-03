import { StyleSheet } from 'react-native';

export const DEFAULT_AVATAR_SIZE = 20;

export const commentUserRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
});
