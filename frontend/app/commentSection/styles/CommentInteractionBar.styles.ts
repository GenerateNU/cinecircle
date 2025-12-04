import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const commentInteractionBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    gap: width * 0.05,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: width * 0.05,
    color: '#777',
  },
});
