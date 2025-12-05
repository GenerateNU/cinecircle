import { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CROP_SIZE = SCREEN_WIDTH * 0.8;

interface ImageCropperProps {
  visible: boolean;
  imageUri: string;
  onCropComplete: (croppedUri: string) => void;
  onCancel: () => void;
  aspectRatio?: [number, number];
  circular?: boolean;
}

export default function ImageCropper({
  visible,
  imageUri,
  onCropComplete,
  onCancel,
  aspectRatio = [1, 1],
  circular = true,
}: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleCrop = async () => {
    try {
      setProcessing(true);

      // Crop and resize the image
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [
          { resize: { width: CROP_SIZE * scale } },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      onCropComplete(manipulatedImage.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Adjust Photo</Text>
          <TouchableOpacity onPress={handleCrop} disabled={processing}>
            <Text style={[styles.doneText, processing && styles.disabled]}>
              {processing ? 'Processing...' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Preview with Circular Overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              {
                transform: [{ scale }],
              },
            ]}
            resizeMode="cover"
          />

          {/* Circular Crop Overlay */}
          {circular && (
            <View style={styles.overlayContainer}>
              <View style={styles.cropCircle} />
            </View>
          )}
        </View>

        {/* Zoom Controls */}
        <View style={styles.controls}>
          <View style={styles.zoomContainer}>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={handleZoomOut}
            >
              <MaterialIcons name="remove" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.scaleIndicator}>
              <View style={styles.scaleTrack}>
                <View
                  style={[
                    styles.scaleThumb,
                    { left: `${((scale - 0.5) / 2.5) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.zoomButton}
              onPress={handleZoomIn}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.instructionText}>
            Pinch to zoom • Drag to reposition
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  doneText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropCircle: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderRadius: CROP_SIZE / 2,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleIndicator: {
    flex: 1,
  },
  scaleTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  scaleThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    top: -8,
    marginLeft: -10,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.7,
  },
});
