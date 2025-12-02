import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
    minWidth: width * 0.03,
  },
  icon: {
    fontSize: width * 0.05,
    color: '#666',
  },
  count: {
    fontSize: width * 0.0325,
    color: '#666',
    fontWeight: '500',
  },
});

