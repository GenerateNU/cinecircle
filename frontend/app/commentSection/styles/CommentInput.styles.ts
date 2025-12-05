import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const AVATAR_SIZE = width * 0.09;

export const commentInputStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: 8,
    marginBottom: height * 0.01,
    marginLeft: AVATAR_SIZE + width * 0.025,
  },
  replyingToText: {
    fontSize: width * 0.032,
    color: '#666',
    flex: 1,
  },
  cancelIcon: {
    fontSize: width * 0.045,
    color: '#999',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    marginRight: width * 0.025,
  },
  avatarPlaceholder: {
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: AVATAR_SIZE * 0.45,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: height * 0.01,
    fontSize: width * 0.035,
    color: '#333',
    maxHeight: height * 0.12,
    minHeight: height * 0.045,
  },
  sendButton: {
    backgroundColor: '#D62E05',
    width: width * 0.085,
    height: width * 0.085,
    borderRadius: width * 0.0425,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.025,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  sendIcon: {
    fontSize: width * 0.045,
    color: '#FFFFFF',
  },
});
