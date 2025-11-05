import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  small: {
    height: height * 0.15,
  },
  smallImage: {
    height: '100%',
  },
  medium: {
    height: height * 0.22,
  },
  mediumImage: {
    height: '100%',
  },
  large: {
    height: height * 0.38,
  },
  largeImage: {
    height: '100%',
  },
});