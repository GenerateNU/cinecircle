import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderBottomWidth: 0.4,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: width * 0.02,
  },
  backIcon: {
    fontSize: width * 0.04,
    fontWeight: '300',
    color: '#333',
  },
  headerTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: width * 0.04,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: height * 0.015,
  },
  eventTitle: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#333',
    flex: 1,
    marginRight: width * 0.025,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: width * 0.025,
  },
  iconButton: {
    width: width * 0.1,
    height: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: width * 0.05,
  },
  detailsSection: {
    marginBottom: height * 0.01,
  },
  descriptionSection: {
    marginBottom: height * 0.025,
  },
  descriptionTitle: {
    fontSize: width * 0.035,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.007,
  },
  descriptionText: {
    fontSize: width * 0.025,
    color: '#666',
    lineHeight: width * 0.03,
    marginBottom: height * 0.02,
  },
  readMoreButton: {
    backgroundColor: '#2563eb',
    borderRadius: width * 0.03,
    paddingVertical: height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: height * 0.04,
  },
  attendeesSection: {
    marginBottom: height * 0.03,
  },
  commentsSection: {
    marginBottom: height * 0.037,
  },
  commentThread: {
    marginTop: height * 0.012,
  },
});