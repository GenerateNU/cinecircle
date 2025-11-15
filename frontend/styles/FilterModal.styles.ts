import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: width * 0.7,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.003,
  },
  title: {
    fontSize: height * 0.025,
    fontWeight: '600',
    color: '#000',
  },
  optionsContainer: {
    maxHeight: height * 0.6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.01,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    marginRight: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 8,
    paddingVertical: height * 0.01,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});