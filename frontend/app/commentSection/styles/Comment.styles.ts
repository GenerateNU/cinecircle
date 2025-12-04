import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const INDENT_PER_LEVEL = width * 0.05;

export const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: height * 0.005,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.005,
  },
  bodyContainer: {
    marginLeft: width * 0.07,
    flexDirection: 'column',
    position: 'relative',
  },
  body: {
    fontSize: width * 0.035,
    color: '#222',
    fontWeight: '400',
    marginLeft: width * 0.025,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.05,
    pointerEvents: 'none',
  },
  expandTextContainer: {
    alignSelf: 'center',
    position: 'absolute',
    marginBottom: height * 0.01,
    bottom: 0,
    zIndex: 1,
  },
  expandText: {
    fontSize: width * 0.03,
    color: '#D62E05',
    fontWeight: '400',
  },
  interactionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewMoreTextContainer: {
    paddingVertical: height * 0.002,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
    justifyContent: 'flex-end',
  },
  viewMoreText: {
    fontSize: width * 0.03,
    color: '#D62E05',
    fontWeight: '400',
  },
  viewMoreIcon: {
    fontSize: width * 0.025,
    color: '#D62E05',
    fontWeight: '400',
  },
});
