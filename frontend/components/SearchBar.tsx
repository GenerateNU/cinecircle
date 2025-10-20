import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
type SearchBarProps = {
    onBack?: () => void;
    placeholder?: string;
};
export default function SearchBar({ onBack, placeholder = "Enter search text" }: SearchBarProps) {
    return (
        <View style={styles.container}>
            {onBack && (
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
            )}
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#999"
            />
            <View style={styles.searchIcon}>
                <Text>:mag:</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        paddingTop: 60,
    },
    backButton: {
        marginRight: 12,
    },
    backButtonText: {
        fontSize: 28,
        color: '#000',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    searchIcon: {
        marginLeft: 8,
    },
});