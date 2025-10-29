import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';

type UserBarProps = {
    name: string;
    username?: string;
    date?: string;
    avatarUri?: string;
    avatarSize?: number;
};

export default function UserBar({
                                    name,
                                    username,
                                    date,
                                    avatarUri,
                                    avatarSize = 40
                                }: UserBarProps) {
    return (
        <View style={styles.container}>
            <Avatar uri={avatarUri} size={avatarSize} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                {username && date && (
                    <Text style={styles.metadata}>@{username} · {date}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    metadata: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
});