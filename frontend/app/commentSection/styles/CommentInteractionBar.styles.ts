import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const commentInteractionBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: height * 0.01,
    gap: width * 0.05,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: width * 0.04,
    color: '#777',
  },
});
