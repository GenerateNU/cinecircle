import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.03,
    height: height * 0.15,
  },
  avatar: {
    borderRadius: width * 0.05,
    backgroundColor: '#d0d0d0',
    marginRight: width * 0.02,
    height: height * 0.01,
    width: width * 0.01
  },
  placeholder: {
    color: '#999',
    flex: 1,
  },
  small: {
    padding: width * 0.025,
  },
  smallAvatar: {
    width: width * 0.04,
    height: width * 0.04,
  },
  smallText: {
    fontSize: width * 0.01,
  },
  medium: {
    padding: width * 0.03,
  },
  mediumAvatar: {
    width: width * 0.06,
    height: width * 0.06,
  },
  mediumText: {
    fontSize: width * 0.015,
  },
  large: {
    padding: width * 0.04,
  },
  largeAvatar: {
    width: width * 0.08,
    height: width * 0.08,
  },
  largeText: {
    fontSize: width * 0.02,
  },
});