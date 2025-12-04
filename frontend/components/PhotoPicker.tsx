import { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

// testing shape for cropper - circle for now
interface ImagePickerProps {
  onImageSelected?: (uri: string) => void;
  currentImage?: string | null;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
}

export default function ImagePicker({ 
  onImageSelected, 
  currentImage,
  size = 'medium',
  shape = 'square'
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);

  const requestPermissions = async () => {
    const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Enable permissions to upload a photo.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    // might need to equest permissions
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: shape === 'circle' ? [1, 1] : [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        if (onImageSelected) {
          onImageSelected(imageUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (onImageSelected) {
      onImageSelected('');
    }
  };

  const sizeStyles = {
    small: { width: 80, height: 80 },
    medium: { width: 120, height: 120 },
    large: { width: 200, height: 200 },
  };

  const containerSize = sizeStyles[size];
  const isCircle = shape === 'circle';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.imageContainer,
          containerSize,
          isCircle && styles.circleContainer,
          !selectedImage && styles.emptyContainer,
        ]}
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {selectedImage ? (
          <>
            <Image
              source={{ uri: selectedImage }}
              style={[
                styles.image,
                containerSize,
                isCircle && styles.circleImage,
              ]}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <MaterialIcons name="edit" size={24} color="#fff" />
            </View>
          </>
        ) : (
          <View style={styles.placeholderContent}>
            <MaterialIcons name="add-photo-alternate" size={40} color="#999" />
            <Text style={styles.placeholderText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {selectedImage && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={removeImage}
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  circleContainer: {
    borderRadius: 999,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  circleImage: {
    borderRadius: 999,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});