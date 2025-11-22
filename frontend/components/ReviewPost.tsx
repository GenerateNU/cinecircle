import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';
import StarRating from './StarRating';

const { width } = Dimensions.get('window');

type ReviewPostProps = {
    userName: string;
    username: string;
    date: string;
    avatarUri?: string;
    reviewerName: string;
    reviewerAvatarUri?: string;
    movieTitle: string;
    rating?: number;
    userId?: string;
    reviewerUserId?: string;
};

export default function ReviewPost({
    userName,
    username,
    date,
    avatarUri,
    reviewerName,
    reviewerAvatarUri,
    movieTitle,
    rating = 5,
    userId,
    reviewerUserId,
}: ReviewPostProps) {
    return (
        <View style={styles.container}>
            <UserBar
                name={userName}
                username={username}
                date={date}
                avatarUri={avatarUri}
                userId={userId}
            />

            <View style={styles.nestedReview}>
                <UserBar
                    name={reviewerName}
                    avatarUri={reviewerAvatarUri}
                    avatarSize={width * 0.06}
                    userId={reviewerUserId}
                />
                <Text style={styles.movieTitle}>{movieTitle}</Text>

                <StarRating 
                    maxStars={5}
                    rating={rating}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderRadius: width * 0.03,
        padding: width * 0.04,
        marginBottom: width * 0.04,
        width: '100%',
    },
    nestedReview: {
        backgroundColor: '#F8F8F8',
        borderRadius: width * 0.02,
        padding: width * 0.03,
        marginTop: width * 0.03,
        width: '100%',
    },
    movieTitle: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#000',
        marginTop: width * 0.02,
        marginBottom: width * 0.02,
        flexShrink: 1,
    },
});