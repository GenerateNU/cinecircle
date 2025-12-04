import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const threadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.02,
    marginRight: width * 0.02,
  },
  backIcon: {
    fontSize: width * 0.06,
    color: '#333',
  },
  headerTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#555',
    fontSize: width * 0.04,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  errorText: {
    color: '#D62E05',
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  retryButton: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    backgroundColor: '#D62E05',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  threadLine: {
    position: 'absolute',
    width: 1,
    top: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    borderRadius: 2,
    marginTop: height * 0.04,
    marginBottom: height * 0.015,
  },
  replyContainer: {
    position: 'relative',
    marginLeft: width * 0.045,
  },
  rootCommentContainer: {
    marginBottom: height * 0.01,
  },
});
