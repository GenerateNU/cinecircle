import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type SearchBarProps = {
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
};

export default function SearchBar({ 
    placeholder = "Search", 
    onChangeText,
    value 
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    onChangeText={onChangeText}
                    value={value}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'transparent',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#D62E05',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
});
