import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
    width: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#000000ff',
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#d0d0d0',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
});