import { StyleSheet } from 'react-native';

export const INDENT_PER_LEVEL = 12;

export const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 28,
  },
  threadBar: {
    width: 2,
    marginRight: 8,
    borderRadius: 1,
    backgroundColor: '#ddd',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  body: {
    fontSize: 15,
    color: '#222',
    marginHorizontal: 28,
    justifyContent: 'center',
  },
  expandText: {
    fontSize: 12,
    color: '#D62E05',
    fontWeight: '400',
    textAlign: 'center',
  },
  interactionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  continueThreadText: {
    paddingVertical: 2,
    color: '#D62E05',
    fontSize: 12,
    textAlign: 'right',
  },
  actionText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    marginRight: 16,
  },
});
