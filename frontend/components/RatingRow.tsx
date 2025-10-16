import { View, Text, StyleSheet } from 'react-native';

type RatingRowProps = {
    label: string;
    rating: number; // 0-5
};

export default function RatingRow({ label, rating }: RatingRowProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                        {star <= rating ? '★' : '☆'}
                    </Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    starsContainer: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 22,
        color: '#D3D3D3',
        marginHorizontal: 2,
    },
});