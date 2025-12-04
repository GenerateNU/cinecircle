import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export const commentThreadStyles = StyleSheet.create({
  container: {
    position: 'relative',
    marginLeft: width * 0.025,
  },
  threadContainer: {
    flex: 1,
  },
  threadLine: {
    position: 'absolute',
    width: 1,
    top: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    borderRadius: 2,
    marginLeft: width * 0.0495,
    marginTop: height * 0.045,
    marginBottom: height * 0.03,
  },
  viewMoreTextContainer: {
    paddingVertical: height * 0.002,
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.01,
    marginBottom: height * 0.01,
  },
  viewMoreText: {
    fontSize: width * 0.03,
    color: '#D62E05',
    fontWeight: '400',
    alignSelf: 'flex-start',
  },
  viewMoreIcon: {
    fontSize: width * 0.03,
    color: '#D62E05',
    fontWeight: '400',
  },
});
