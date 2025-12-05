import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const commentInteractionBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.01,
    gap: width * 0.05,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
    minWidth: width * 0.08,
  },
  icon: {
    fontSize: width * 0.04,
    color: '#777',
  },
  likedIcon: {
    color: '#e74c3c',
  },
  likeCount: {
    fontSize: width * 0.032,
    color: '#777',
    minWidth: width * 0.025,
  },
  likedText: {
    color: '#e74c3c',
  },
});
