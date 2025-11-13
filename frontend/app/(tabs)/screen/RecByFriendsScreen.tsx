import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import SearchBar from '../../../components/SearchBar';
import TextPost from '../../../components/TextPost';
import PicturePost from '../../../components/PicturePost';
import ReviewPost from '../../../components/ReviewPost';

const { width } = Dimensions.get('window');

export default function RecByFriendsScreen() {
    return (
        <View style={styles.container}>
            <SearchBar placeholder="Search" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Picture Post - Kaamil's SRK post */}
                <PicturePost
                    userName="Kaamil Thobani"
                    username="kaa"
                    date="Sept 16"
                    content="SRK in his lover era again and I'm not surviving this one chat"
                />

                {/* Text Post - Emily's Tamasha post */}
                <TextPost
                    userName="Emily Choi"
                    username="emmy"
                    date="Sept 12"
                    content="Tamasha hits different now that I'm old enough to realize I'm the villain and the main character."
                />

                {/* Review Post - Tony's Dangal review */}
                <ReviewPost
                    userName="Tony Giech"
                    username="tonyg"
                    date="Sept 10"
                    reviewerName="Rowen Latif"
                    movieTitle="Dangal"
                    rating={5}
                />
                {/* Review Post - Amogh's Saiyaara review */}
                <ReviewPost
                    userName="Amogh"
                    username="aamogh16"
                    date="October 10"
                    reviewerName="Kaamil Thobani"
                    movieTitle="Saiyaara"
                    rating={4}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: width * 0.04,
        paddingBottom: width * 0.08,
    },
});