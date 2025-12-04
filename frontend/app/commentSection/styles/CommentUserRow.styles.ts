import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DEFAULT_AVATAR_SIZE = width * 0.06;

export const commentUserRowStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.0125,
  },
  avatarText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },
  username: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#111',
  },
  timestamp: {
    fontSize: width * 0.03,
    color: '#888',
  },
});
