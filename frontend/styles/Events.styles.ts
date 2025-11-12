import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: height * 0.075,
  },
  header: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.01,
  },
  horizontalScroll: {
    paddingLeft: width * 0.05,
    marginBottom: height * 0.012,
  },
  eventCardWrapper: {
    marginRight: width * 0.04,
  },
  sectionTitle: {
    fontSize: width * 0.03,
    fontWeight: '600',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.025,
    marginBottom: height * 0.018,
  },
  categoriesContainer: {
    paddingLeft: width * 0.05,
    marginBottom: height * 0.012,
  },
});