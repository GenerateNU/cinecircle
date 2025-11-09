import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Avatar from './Avatar';

const { width } = Dimensions.get('window');

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
                                    avatarSize = width * 0.1
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
        marginLeft: width * 0.03,
        flex: 1,
    },
    name: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#000',
    },
    metadata: {
        fontSize: width * 0.0325,
        color: '#666',
        marginTop: width * 0.005,
    },
});