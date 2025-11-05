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
    marginBottom: height * 0.012,
  },
  smallTitle: {
    fontSize: width * 0.042,
  },
  smallIcon: {
    fontSize: width * 0.05,
  },
  medium: {
    marginBottom: height * 0.018,
  },
  mediumTitle: {
    fontSize: width * 0.05,
  },
  mediumIcon: {
    fontSize: width * 0.06,
  },
  large: {
    marginBottom: height * 0.025,
  },
  largeTitle: {
    fontSize: width * 0.058,
  },
  largeIcon: {
    fontSize: width * 0.07,
  },
});