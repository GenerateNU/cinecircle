import { View, Text, StyleSheet } from 'react-native';
type TagListProps = {
    tags: string[];
};
export default function TagList({ tags }: TagListProps) {
    return (
        <View style={styles.container}>
            {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                </View>
            ))}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    tag: {
        backgroundColor: '#E8E8E8',
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    tagText: {
        fontSize: 13,
        color: '#333',
    },
});