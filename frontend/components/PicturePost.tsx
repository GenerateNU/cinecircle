import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserBar from './UserBar';

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
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    content: {
        fontSize: 15,
        color: '#000',
        lineHeight: 20,
        marginTop: 12,
        marginBottom: 12,
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#E8E8E8',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
});