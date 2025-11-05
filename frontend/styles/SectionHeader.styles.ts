import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontWeight: '600',
  },
  searchIcon: {},
  small: {
    marginBottom: height * 0.01,
  },
  smallTitle: {
    fontSize: width * 0.02,
  },
  smallIcon: {
    fontSize: width * 0.01,
  },
  medium: {
    marginBottom: height * 0.02,
  },
  mediumTitle: {
    fontSize: width * 0.03,
  },
  mediumIcon: {
    fontSize: width * 0.03,
  },
  large: {
    marginBottom: height * 0.03,
  },
  largeTitle: {
    fontSize: width * 0.04,
  },
  largeIcon: {
    fontSize: width * 0.05,
  },
});