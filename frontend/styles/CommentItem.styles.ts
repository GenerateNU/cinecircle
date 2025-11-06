import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: height * 0.018,
  },
  avatar: {
    borderRadius: width * 0.05,
    backgroundColor: '#d0d0d0',
    marginRight: width * 0.03,
  },
  content: {
    flex: 1,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: width * 0.02,
  },
  small: {
    width: width * 0.03,
    height: width * 0.03,
  },
  medium: {
    width: width * 0.05,
    height: width * 0.05,
  },
  large: {
    width: width * 0.08,
    height: width * 0.08,
  },
});