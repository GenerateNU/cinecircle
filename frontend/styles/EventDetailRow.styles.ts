import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.018,
  },
  icon: {
    marginRight: width * 0.01,
    width: width * 0.06,
  },
  text: {
    color: '#666',
    flex: 1,
  },
  small: {
    marginBottom: height * 0.002,
  },
  smallIcon: {
    fontSize: width * 0.015,
  },
  smallText: {
    fontSize: width * 0.012,
  },
  medium: {
    marginBottom: height * 0.008,
  },
  mediumIcon: {
    fontSize: width * 0.025,
  },
  mediumText: {
    fontSize: width * 0.018,
  },
  large: {
    marginBottom: height * 0.01,
  },
  largeIcon: {
    fontSize: width * 0.035,
  },
  largeText: {
    fontSize: width * 0.022,
  },
});