import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';

const { width } = Dimensions.get('window');

type PicturePostProps = {
    userName: string;
    username: string;
    date: string;
    avatarUri?: string;
    content: string;
    imageUris?: string[]; // For future image carousel
};

export default function PicturePost({
                                        userName,
                                        username,
                                        date,
                                        avatarUri,
                                        content,
                                        imageUris,
                                    }: PicturePostProps) {
    return (
        <View style={styles.container}>
            <UserBar
                name={userName}
                username={username}
                date={date}
                avatarUri={avatarUri}
            />
            <Text style={styles.content}>{content}</Text>

            {/* Image carousel component will go here */}
            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Image Carousel</Text>
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
    content: {
        fontSize: width * 0.0375,
        color: '#000',
        lineHeight: width * 0.05,
        marginTop: width * 0.03,
        marginBottom: width * 0.03,
        flexShrink: 1,
    },
    imagePlaceholder: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#E8E8E8',
        borderRadius: width * 0.02,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: width * 0.03,
    },
    placeholderText: {
        color: '#999',
        fontSize: width * 0.035,
    },
});