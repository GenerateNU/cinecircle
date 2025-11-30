import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#6FB4E8',
    marginBottom: height * 0.03,
  },
  registerSection: {
    backgroundColor: '#fff',
    borderRadius: width * 0.04,
    padding: width * 0.08,
  },
  registerTitle: {
    fontSize: width * 0.055,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.04,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.04,
    gap: width * 0.03,
  },
  optionCard: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFE5E5',
    borderRadius: width * 0.04,
    borderWidth: 2,
    borderColor: '#FFD1D1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.03,
  },
  optionCardSelected: {
    backgroundColor: '#E87E6F',
    borderColor: '#E87E6F',
  },
  optionEmoji: {
    fontSize: width * 0.1,
    marginBottom: height * 0.015,
  },
  optionText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#FFD1D1',
    borderRadius: width * 0.03,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#8B3A2B',
  },
  continueText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#D89C8F',
  },
  continueTextActive: {
    color: '#fff',
  },
});