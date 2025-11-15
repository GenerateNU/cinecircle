import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.045,
    overflow: 'hidden',
  },
  small: {
    width: width * 0.3,
    height: height * 0.2,
    marginRight: width * 0.001,
  },
  medium: {
    width: width * 0.4,
    height: height * 0.3,
    marginRight: width * 0.002,
  },
  large: {
    width: width * 0.5,
    height: height * 0.4,
    marginRight: width * 0.003,
  },
  image: {
    width: '100%',
    backgroundColor: '#e0e0e0',
  },
  smallImage: {
    height: height * 0.1,
  },
  mediumImage: {
    height: height * 0.2,
  },
  largeImage: {
    height: height * 0.275,
  },
  title: {
    fontWeight: '600',
    padding: width * 0.0375,
    paddingBottom: width * 0.0125,
  },
  smallTitle: {
    fontSize: width * 0.025,
    padding: width * 0.015,
    paddingBottom: width * 0.01,
  },
  mediumTitle: {
    fontSize: width * 0.035,
  },
  largeTitle: {
    fontSize: width * 0.045,
  },
  details: {
    paddingHorizontal: width * 0.0375,
    paddingBottom: width * 0.0275,
  },
  location: {
    color: '#666',
    marginBottom: height * 0.00725,
  },
  dateTime: {
    color: '#666',
  },
  smallText: {
    fontSize: width * 0.01,
    paddingHorizontal: width * 0.015,
    paddingBottom: width * 0.015,
  },
  mediumText: {
    fontSize: width * 0.025,
  },
  largeText: {
    fontSize: width * 0.03,
  },
});