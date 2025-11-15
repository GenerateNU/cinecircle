import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    marginBottom: height * 0.03,
  },
  title: {
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.01,
  },
  address: {
    color: '#666',
    marginBottom: height * 0.01,
  },
  mapContainer: {
    width: '100%',
    borderRadius: width * 0.03,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#999',
  },
  small: {
    height: height * 0.05,
  },
  smallTitle: {
    fontSize: width * 0.02,
  },
  smallAddress: {
    fontSize: width * 0.015,
  },
  smallMapText: {
    fontSize: width * 0.022,
  },
  medium: {
    height: height * 0.15,
  },
  mediumTitle: {
    fontSize: width * 0.025,
  },
  mediumAddress: {
    fontSize: width * 0.02,
  },
  mediumMapText: {
    fontSize: width * 0.03,
  },
  large: {
    height: height * 0.25,
  },
  largeTitle: {
    fontSize: width * 0.03,
  },
  largeAddress: {
    fontSize: width * 0.02,
  },
  largeMapText: {
    fontSize: width * 0.035,
  },
});