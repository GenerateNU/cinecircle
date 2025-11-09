import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: width * 0.0275,
    padding: width * 0.0275,
    marginRight: width * 0.01,
  },
  small: {
    padding: width * 0.02,
    borderRadius: width * 0.02,
  },
  medium: {
    padding: width * 0.0275,
    borderRadius: width * 0.035,
  },
  large: {
    padding: width * 0.04,
    borderRadius: width * 0.035,
  },
  dateBox: {
    backgroundColor: '#333',
    borderRadius: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.0375,
  },
  smallDateBox: {
    width: width * 0.1125,
    height: width * 0.1125,
    marginRight: width * 0.025,
  },
  mediumDateBox: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: width * 0.0375,
  },
  largeDateBox: {
    width: width * 0.1875,
    height: width * 0.1875,
    marginRight: width * 0.05,
  },
  dateMonth: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  smallMonth: {
    fontSize: width * 0.02,
  },
  mediumMonth: {
    fontSize: width * 0.025,
  },
  largeMonth: {
    fontSize: width * 0.03,
  },
  dateDay: {
    fontWeight: 'bold',
    color: '#fff',
  },
  smallDay: {
    fontSize: width * 0.045,
  },
  mediumDay: {
    fontSize: width * 0.06,
  },
  largeDay: {
    fontSize: width * 0.075,
  },
  details: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: height * 0.00625,
  },
  smallTitle: {
    fontSize: width * 0.02,
    marginBottom: height * 0.00375,
  },
  mediumTitle: {
    fontSize: width * 0.025,
    marginBottom: height * 0.00625,
  },
  largeTitle: {
    fontSize: width * 0.035,
    marginBottom: height * 0.0075,
  },
  info: {
    flexDirection: 'column',
    gap: width * 0.01,
  },
  text: {
    color: '#666',
  },
  smallText: {
    fontSize: width * 0.015,
  },
  mediumText: {
    fontSize: width * 0.02,
  },
  largeText: {
    fontSize: width * 0.025,
  },
  arrow: {
    color: '#666',
  },
  smallArrow: {
    fontSize: width * 0.04,
  },
  mediumArrow: {
    fontSize: width * 0.05,
  },
  largeArrow: {
    fontSize: width * 0.06,
  },
});