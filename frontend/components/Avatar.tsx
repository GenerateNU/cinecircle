import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type AvatarProps = {
    uri?: string;
    size?: number;
};

export default function Avatar({ uri, size = width * 0.1 }: AvatarProps) {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
                    resizeMode="cover"
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D3D3D3',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});