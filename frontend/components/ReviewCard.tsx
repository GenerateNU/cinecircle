import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from './StarRating';

export default function ReviewCard() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar} />
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>Name Name</Text>
                    <Text style={styles.userHandle}>@username Date</Text>
                </View>
            </View>

            <View style={styles.nestedReview}>
                <View style={styles.nestedHeader}>
                    <View style={styles.smallAvatar} />
                    <Text style={styles.nestedUserName}>Name Name</Text>
                </View>
                <Text style={styles.reviewTitle}>Lalala This is the title wow</Text>
                <View style={styles.reviewStarsContainer}>
                    <StarRating rating={5} maxStars={5} size={16} />
                    <TouchableOpacity style={styles.bookmarkIcon}>
                        <Text>:bookmark:</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>:heart: 1.23k</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>:speech_balloon: 1.23k</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>:repeat: 1.23k</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>:arrow_upper_right:</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D3D3D3',
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    userHandle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    nestedReview: {
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    nestedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    smallAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D3D3D3',
        marginRight: 8,
    },
    nestedUserName: {
        fontSize: 14,
        fontWeight: '600',
    },
    reviewTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    reviewStarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookmarkIcon: {
        marginLeft: 'auto',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
    },
    actionBtn: {
        flex: 1,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 14,
        color: '#666',
    },
});