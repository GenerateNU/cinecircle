// frontend/app/components/BookmarkModal.tsx
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from 'react-native';
// Ticket images
import wantToWatchDefault from '../assets/tickets/wanttowatch.png';
import wantToWatchSelected from '../assets/tickets/wanttowatchselected.png';
import wantToWatchSmall from '../assets/tickets/wanttowatchsmall.png';
import watchedDefault from '../assets/tickets/watched.png';
import watchedSelected from '../assets/tickets/watchedselected.png';
import watchedSmall from '../assets/tickets/watchedsmall.png';

export type BookmarkStatus = 'TO_WATCH' | 'WATCHED' | null;

interface Props {
  selection: BookmarkStatus;
  onChangeSelection: (status: BookmarkStatus) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function BookmarkModal({
  selection: propSelection,
  onChangeSelection,
  onSave,
  onClose,
}: Props) {
  // Track the initial selection to detect changes
  const initialSelectionRef = useRef<BookmarkStatus>(propSelection);
  const [currentSelection, setCurrentSelection] = useState<BookmarkStatus>(propSelection);
  
  // Update current selection when prop changes
  useEffect(() => {
    setCurrentSelection(propSelection);
    initialSelectionRef.current = propSelection;
  }, [propSelection]);
  
  const hasChanges = currentSelection !== initialSelectionRef.current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const toggleSelect = (status: Exclude<BookmarkStatus, null>) => {
    const newSelection = currentSelection === status ? null : status;
    setCurrentSelection(newSelection);
    onChangeSelection(newSelection);
  };

  const isToWatch = currentSelection === 'TO_WATCH';
  const isWatched = currentSelection === 'WATCHED';

  // No need for additional styles since the images already have their own styling

  const handleSavePress = () => {
    onSave();
  };

  return (
    <View style={styles.overlay}>
      {/* backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.title}>Save to list</Text>

        {/* “Ticket” row – you can replace inner views with images later */}
        <View style={styles.row}>
          {/* Want to Watch */}
          <TouchableOpacity
            onPress={() => toggleSelect('TO_WATCH')}
            activeOpacity={0.9}
          >
            <Image
              source={
                isToWatch
                  ? wantToWatchSelected
                  : isWatched
                  ? wantToWatchSmall
                  : wantToWatchDefault
              }
              resizeMode="contain"
              style={styles.ticketImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleSelect('WATCHED')}
            activeOpacity={0.9}
          >
            <Image
              source={
                isWatched
                  ? watchedSelected
                  : isToWatch
                  ? watchedSmall
                  : watchedDefault
              }
              resizeMode="contain"
              style={styles.ticketImage}
            />
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={onClose}
          >
            <Text style={styles.actionSecondaryText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              !hasChanges
                ? styles.actionButtonDisabled
                : styles.actionButtonPrimary,
            ]}
            onPress={handleSavePress}
            disabled={!hasChanges}
          >
            <Text
              style={[
                styles.actionPrimaryText,
                !hasChanges && { color: '#999' },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 0, // Remove horizontal padding to allow images to touch
    minHeight: 260,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 22,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  ticketOuter: {
    width: 140,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F8B1A1',
    backgroundColor: '#FFE4DC',
    padding: 6,
  },
  ticketOuterActive: {
    borderColor: '#7B3DF0',
  },
  ticketInner: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#F08A6A',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketInnerActive: {},
  ticketText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c45c48',
    textAlign: 'center',
  },
  ticketTextActive: {},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 22,
  },
  label: {
    width: 140,
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 12,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
  },
  actionSecondaryText: {
    color: '#555',
    fontWeight: '600',
  },
  actionButtonPrimary: {
    backgroundColor: '#B8A7E8',
  },
  actionButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  actionPrimaryText: {
    color: '#333',
    fontWeight: '700',
  },
});
