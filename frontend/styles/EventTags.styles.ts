import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    paddingRight: width * 0.05,
  },
  tagPill: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: width * 0.05,
    backgroundColor: '#fff',
    marginRight: width * 0.025,
  },
  tagText: {
    color: '#666',
    fontWeight: '500',
  },
  small: {
    paddingVertical: height * 0.005,
    paddingHorizontal: width * 0.02,
  },
  smallText: {
    fontSize: width * 0.02,
  },
  medium: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.04,
  },
  mediumText: {
    fontSize: width * 0.025,
  },
  large: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
  },
  largeText: {
    fontSize: width * 0.035,
  },
});