import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserBar from './UserBar';

type TextPostProps = {
    userName: string;
    username: string;
    date: string;
    avatarUri?: string;
    content: string;
};

export default function TextPost({
                                     userName,
                                     username,
                                     date,
                                     avatarUri,
                                     content,
                                 }: TextPostProps) {
    return (
        <View style={styles.container}>
            <UserBar
                name={userName}
                username={username}
                date={date}
                avatarUri={avatarUri}
            />
            <Text style={styles.content}>{content}</Text>
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
    },
});