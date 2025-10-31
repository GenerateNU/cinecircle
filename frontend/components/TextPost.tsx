import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';

const { width } = Dimensions.get('window');

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
        flexShrink: 1,
    },
});