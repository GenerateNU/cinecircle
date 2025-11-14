import { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { styles } from "../styles/DropdownSelect.styles";

interface DropdownSelectProps {
  items: string[];
  placeholder?: string;
  onSelect: (item: string) => void;
  selectedValue?: string;
}

export default function DropdownSelect({
  items,
  placeholder = "Select an option",
  onSelect,
  selectedValue,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {items.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.dropdownItem,
                item === selectedValue && styles.selectedItem,
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownText,
                  item === selectedValue && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}