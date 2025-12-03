import { StyleSheet } from 'react-native';

export const INDENT_PER_LEVEL = 12;

export const commentStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
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
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: '#222',
    marginTop: 2,
  },
  expandText: {
    marginTop: 4,
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    marginRight: 16,
  },
});
