import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '60%',
    height: '25%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000ff',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    width: '85%',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000ff',
    marginBottom: 5,
    marginTop: 15,
  },
  selected: {
    backgroundColor: '#000000ff',
  },
  title: {
    paddingHorizontal: 20,
    color: '#333',
    fontSize: 20,
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