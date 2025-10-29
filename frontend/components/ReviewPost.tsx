import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserBar from './UserBar';

type ReviewPostProps = {
    userName: string;
    username: string;
    date: string;
    avatarUri?: string;
    reviewerName: string;
    reviewerAvatarUri?: string;
    movieTitle: string;
    rating?: number; // For future star component
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
                                   }: ReviewPostProps) {
    return (
        <View style={styles.container}>
            <UserBar
                name={userName}
                username={username}
                date={date}
                avatarUri={avatarUri}
            />

            <View style={styles.nestedReview}>
                <UserBar
                    name={reviewerName}
                    avatarUri={reviewerAvatarUri}
                    avatarSize={24}
                />
                <Text style={styles.movieTitle}>{movieTitle}</Text>

                {/* Star rating component will go here */}
                <View style={styles.starPlaceholder}>
                    <Text style={styles.placeholderText}>★ ★ ★ ★ ★</Text>
                </View>
            </View>

            {/* PostActions component will go here */}
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
    nestedReview: {
        backgroundColor: '#F8F8F8',
        borderRadius: 8,
        padding: 12,
        marginTop: 12,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginTop: 8,
        marginBottom: 8,
    },
    starPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 18,
        color: '#FFD700',
    },
});