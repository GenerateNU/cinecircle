import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

type FilterBarProps = {
    onSpoilerToggle?: (enabled: boolean) => void;
    onFilterChange?: (filter: string) => void;
};

export default function FilterBar({ 
    onSpoilerToggle,
    onFilterChange 
}: FilterBarProps) {
    const [spoilerEnabled, setSpoilerEnabled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Hot');

    const filterOptions = ['Hot', 'New', 'Top', 'Rising'];

    const handleSpoilerToggle = () => {
        const newValue = !spoilerEnabled;
        setSpoilerEnabled(newValue);
        onSpoilerToggle?.(newValue);
    };

    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setIsDropdownOpen(false);
        onFilterChange?.(filter);
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                {/* Spoiler Toggle */}
                <View style={styles.spoilerSection}>
                    <Text style={styles.label}>Spoiler</Text>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            spoilerEnabled && styles.toggleButtonActive
                        ]}
                        onPress={handleSpoilerToggle}
                        activeOpacity={0.8}
                    >
                        <View
                            style={[
                                styles.toggleCircle,
                                spoilerEnabled && styles.toggleCircleActive
                            ]}
                        />
                    </TouchableOpacity>
                </View>

                {/* Filter Dropdown */}
                <View>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        activeOpacity={0.7}
                    >
                        <Feather name="zap" size={20} color="#000" />
                        <Text style={styles.filterText}>{selectedFilter}</Text>
                        <Feather 
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                            size={20} 
                            color="#000" 
                        />
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <View style={styles.dropdown}>
                            {filterOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.dropdownItem,
                                        selectedFilter === option && styles.dropdownItemActive
                                    ]}
                                    onPress={() => handleFilterSelect(option)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownItemText,
                                            selectedFilter === option && styles.dropdownItemTextActive
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFE5D9',
        borderBottomWidth: 1,
        borderBottomColor: '#FFD4C1',
    },
    contentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    spoilerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    toggleButton: {
        width: 56,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        padding: 2,
    },
    toggleButtonActive: {
        backgroundColor: '#FF9B7C',
    },
    toggleCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    toggleCircleActive: {
        alignSelf: 'flex-end',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    filterText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 120,
        zIndex: 1000,
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownItemActive: {
        backgroundColor: '#FFE5D9',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    dropdownItemTextActive: {
        color: '#FF6B3D',
        fontWeight: '600',
    },
});