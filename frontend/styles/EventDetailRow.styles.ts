import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.018,
  },
  icon: {
    marginRight: width * 0.02,
    width: width * 0.05,
  },
  text: {
    color: '#666',
    flex: 1,
  },
  small: {
    marginBottom: height * 0.003,
  },
  smallIcon: {
    fontSize: width * 0.02,
  },
  smallText: {
    fontSize: width * 0.02,
  },
  medium: {
    marginBottom: height * 0.008,
  },
  mediumIcon: {
    fontSize: width * 0.04,
  },
  mediumText: {
    fontSize: width * 0.03,
  },
  large: {
    marginBottom: height * 0.01,
  },
  largeIcon: {
    fontSize: width * 0.06,
  },
  largeText: {
    fontSize: width * 0.04,
  },
});