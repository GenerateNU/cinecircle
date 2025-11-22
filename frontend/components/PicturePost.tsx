import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import UserBar from './UserBar';
import MyCarousel from './Carousel';

const { width } = Dimensions.get('window');

type PicturePostProps = {
    userName: string;
    username: string;
    date: string;
    avatarUri?: string;
    content: string;
    imageUrls?: string[];
    userId?: string;
};

export default function PicturePost({
    userName,
    username,
    date,
    avatarUri,
    content,
    imageUrls = [],
    userId,
}: PicturePostProps) {
    const imageComponents = imageUrls.map((url, index) => (
        <Image 
            source={{ uri: url }} 
            style={styles.image}
            resizeMode="cover"
            key={`image-${index}`}
        />
    ));

    return (
        <View style={styles.container}>
            <UserBar
                name={userName}
                username={username}
                date={date}
                avatarUri={avatarUri}
                userId={userId}
            />
            <Text style={styles.content}>{content}</Text>

            {imageUrls.length > 0 ? (
                <MyCarousel 
                    components={imageComponents}
                    width={100}
                    height={40}
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
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
    image: {
        width: '100%',
        height: '100%',
        borderRadius: width * 0.02,
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