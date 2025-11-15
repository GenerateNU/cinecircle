import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/FilterModal.styles';

export interface FilterOption {
  id: string;
  label: string;
  value: string | number;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onApply: (selectedValues: string[]) => void;
  multiSelect?: boolean;
}

export default function FilterModal({
  visible,
  onClose,
  title,
  options,
  selectedValues,
  onApply,
  multiSelect = true,
}: FilterModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedValues);

  const toggleOption = (optionId: string) => {
    if (multiSelect) {
      setLocalSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setLocalSelected([optionId]);
    }
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const handleClose = () => {
    setLocalSelected(selectedValues); // Reset to original values
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected = localSelected.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionRow}
                  onPress={() => toggleOption(option.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}