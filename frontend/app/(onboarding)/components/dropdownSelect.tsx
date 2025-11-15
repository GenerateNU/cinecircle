import { useState } from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { styles } from "../styles/DropdownSelect.styles";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window')

interface DropdownSelectProps {
  title?: string;
  items: string[];
  placeholder?: string;
  onSelect: (item: string) => void;
  selectedValue?: string;
}

export default function DropdownSelect({
  title = "Select an option",
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
      {title && <Text style={styles.title}>{title}</Text>}
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !selectedValue && styles.placeholderText]}>
          {selectedValue || placeholder}
        </Text>
        <MaterialIcons 
          name="arrow-forward-ios" 
          style={{ 
            transform: [{ rotate: isOpen ? '90deg' : '270deg' }],
            fontSize: width * 0.04 
          }}
        />
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
