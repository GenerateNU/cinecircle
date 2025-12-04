import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const commentSectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: width * 0.025,
  },
  header: {
    fontWeight: '400',
    marginBottom: height * 0.01,
  },
  threadContainer: {
    paddingRight: width * 0.04,
  },
  viewMoreButton: {
    marginTop: height * 0.01,
  },
  viewMoreText: {
    fontSize: width * 0.03,
    color: '#D62E05',
    fontWeight: '400',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#D62E05',
  },
});
