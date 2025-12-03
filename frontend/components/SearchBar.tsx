import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type SearchBarProps = {
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    onPress?: () => void;
    editable?: boolean;
};

export default function SearchBar({ 
    placeholder = "Search", 
    onChangeText,
    value,
    onPress,
    editable = true,
}: SearchBarProps) {
    const content = (
        <View style={styles.searchBox}>
            <Feather name="search" size={width * 0.05} color="#999" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder={placeholder}
                placeholderTextColor="#999"
                onChangeText={onChangeText}
                value={value}
                editable={editable && !onPress}
                pointerEvents={onPress ? 'none' : 'auto'}
            />
        </View>
    );

    if (onPress) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                    {content}
                </TouchableOpacity>
            </View>
        );
    }

    return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
    container: {
        padding: width * 0.04,
        backgroundColor: '#FFF',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#D62E05',
        borderRadius: width * 0.02,
        paddingHorizontal: width * 0.03,
        height: width * 0.12,
    },
    searchIcon: {
        marginRight: width * 0.02,
    },
    searchInput: {
        flex: 1,
        fontSize: width * 0.04,
        color: '#000',
    },
});