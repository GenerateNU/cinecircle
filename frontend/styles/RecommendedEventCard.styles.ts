import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.04,
    marginHorizontal: width * 0.05,
  },
  image: {
    backgroundColor: '#e0e0e0',
    borderRadius: width * 0.025,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: height * 0.006,
  },
  dateTime: {
    color: '#666',
    marginBottom: height * 0.004,
  },
  location: {
    color: '#666',
    marginBottom: height * 0.004,
  },
  attendees: {
    color: '#666',
    marginTop: height * 0.006,
  },
  small: {
    padding: width * 0.03,
    marginBottom: height * 0.012,
  },
  smallImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginRight: width * 0.03,
  },
  smallTitle: {
    fontSize: width * 0.025,
  },
  smallText: {
    fontSize: width * 0.018,
  },
  medium: {
    padding: width * 0.03,
    marginBottom: height * 0.008,
  },
  mediumImage: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: width * 0.03,
  },
  mediumTitle: {
    fontSize: width * 0.03,
  },
  mediumText: {
    fontSize: width * 0.02,
  },
  large: {
    padding: width * 0.05,
    marginBottom: height * 0.025,
  },
  largeImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginRight: width * 0.04,
  },
  largeTitle: {
    fontSize: width * 0.035,
  },
  largeText: {
    fontSize: width * 0.025,
  },
});