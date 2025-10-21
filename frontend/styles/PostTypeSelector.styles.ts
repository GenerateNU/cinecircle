import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selected: {
    backgroundColor: '#007AFF',
  },
  text: {
    color: '#333',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});