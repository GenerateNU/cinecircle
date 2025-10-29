import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: width * 0.6,
    height: height * 0.25,
    paddingVertical: height * 0.01,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: height * 0.03,
  },
  button: {
    alignItems: 'center',
    width: '85%',
    paddingVertical: height * 0.01,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    marginTop: height * 0.015,
  },
  title: {
    paddingHorizontal: width * 0.025,
    color: '#333',
    fontSize: width * 0.05,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});