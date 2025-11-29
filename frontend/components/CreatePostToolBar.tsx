import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface CreatePostToolBarProps {
  onToolbarAction: (action: string) => void;
}

export default function CreatePostToolBar({ onToolbarAction }: CreatePostToolBarProps) {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity
        onPress={() => onToolbarAction("rating")}
        style={styles.toolbarItem}
      >
        <Text style={styles.toolbarText}>Rating</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToolbarAction("video")}
        style={styles.toolbarItem}
      >
        <Text style={styles.toolbarText}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToolbarAction("gif")}
        style={styles.toolbarItem}
      >
        <Text style={styles.toolbarText}>GIF</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToolbarAction("photo")}
        style={styles.toolbarItem}
      >
        <Text style={styles.toolbarText}>Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 20,
  },
  toolbarItem: {
    alignItems: 'center',
  },
  toolbarText: {
    fontSize: 14,
    color: '#E05B4E',
  },
});
