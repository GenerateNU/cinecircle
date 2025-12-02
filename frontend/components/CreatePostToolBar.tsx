import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import ImagePic from '../assets/image.png';
import Gif from '../assets/gif.png';
import Keyboard from '../assets/keyboard-down.png';

interface CreatePostToolBarProps {
  onToolbarAction: (action: string) => void;
}

export default function CreatePostToolBar({ onToolbarAction }: CreatePostToolBarProps) {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity
        onPress={() => onToolbarAction("video")}
        style={styles.toolbarItem}
      >
        <View style={styles.row}>
          <Image source={ImagePic} resizeMode="contain" style={styles.icon} />
          <Text style={styles.toolbarText}>Photo and Video</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToolbarAction("gif")}
        style={styles.toolbarItem}
      >
        <View style={styles.row}>
          <Image source={Gif} resizeMode="contain" style={styles.icon} />
          <Text style={styles.toolbarText}>GIF</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToolbarAction("photo")}
        style={styles.toolbarItem}
      >
        <View style={styles.row}>
          <Image source={Keyboard} resizeMode="contain" style={styles.icon} />
          <Text style={styles.toolbarText}>Keyboard Down</Text>
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 20,
    height: 20,
  },
  toolbarText: {
    fontSize: 14,
    color: '#979797',
    fontFamily: "Figtree_500Medium"
  },
});
