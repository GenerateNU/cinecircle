import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';

const { width } = Dimensions.get('window');

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
                    avatarSize={width * 0.06}
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
    starPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    placeholderText: {
        fontSize: width * 0.045,
        color: '#FFD700',
    },
});