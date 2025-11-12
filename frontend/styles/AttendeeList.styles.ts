import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: width * 0.065,
    backgroundColor: '#e0e0e0',
    marginRight: -width * 0.025,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c0c0c0',
  },
  moreAttendees: {
    borderRadius: width * 0.065,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.025,
  },
  moreText: {
    color: '#666',
    fontWeight: '600',
  },
  small: {
    width: width * 0.05,
    height: width * 0.05,
  },
  smallPlaceholder: {
    borderRadius: width * 0.04,
  },
  smallText: {
    fontSize: width * 0.028,
  },
  medium: {
    width: width * 0.08,
    height: width * 0.08,
  },
  mediumPlaceholder: {
    borderRadius: width * 0.065,
  },
  mediumText: {
    fontSize: width * 0.035,
  },
  large: {
    width: width * 0.1,
    height: width * 0.1,
  },
  largePlaceholder: {
    borderRadius: width * 0.08,
  },
  largeText: {
    fontSize: width * 0.04,
  },
});