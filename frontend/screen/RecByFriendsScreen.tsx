import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import TextPost from '../components/TextPost';
import PicturePost from '../components/PicturePost';
import ReviewPost from '../components/ReviewPost';
import InteractionBar from '../components/InteractionBar';

const { width } = Dimensions.get('window');

export default function RecByFriendsScreen() {
    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Picture Post - Kaamil's SRK post */}
            <View style={styles.postContainer}>
                <PicturePost
                    userName="Kaamil Thobani"
                    username="kaa"
                    date="Sept 16"
                    content="SRK in his lover era again and I'm not surviving this one chat"
                />
                <View style={styles.interactionWrapper}>
                    <InteractionBar 
                        initialLikes={1230}
                        initialComments={1230}
                        isLiked={false}
                        onLikePress={() => console.log('Liked Kaamil post')}
                        onCommentPress={() => console.log('Comment on Kaamil post')}
                    />
                </View>
            </View>
            <View style={styles.divider} />

            {/* Text Post - Emily's Tamasha post */}
            <View style={styles.postContainer}>
                <TextPost
                    userName="Emily Choi"
                    username="emmy"
                    date="Sept 12"
                    content="Tamasha hits different now that I'm old enough to realize I'm the villain and the main character."
                />
                <View style={styles.interactionWrapper}>
                    <InteractionBar 
                        initialLikes={1230}
                        initialComments={1230}
                        isLiked={false}
                        onLikePress={() => console.log('Liked Emily post')}
                        onCommentPress={() => console.log('Comment on Emily post')}
                    />
                </View>
            </View>
            <View style={styles.divider} />

            {/* Review Post - Tony's Dangal review */}
            <View style={styles.postContainer}>
                <ReviewPost
                    userName="Tony Giech"
                    username="tonyg"
                    date="Sept 10"
                    reviewerName="Rowen Latif"
                    movieTitle="Dangal"
                    rating={5}
                />
                <View style={styles.interactionWrapper}>
                    <InteractionBar 
                        initialLikes={1230}
                        initialComments={1230}
                        isLiked={false}
                        onLikePress={() => console.log('Liked Tony post')}
                        onCommentPress={() => console.log('Comment on Tony post')}
                    />
                </View>
            </View>
            <View style={styles.divider} />

            {/* Review Post - Amogh's Saiyaara review */}
            <View style={styles.postContainer}>
                <ReviewPost
                    userName="Amogh"
                    username="aamogh16"
                    date="October 10"
                    reviewerName="Kaamil Thobani"
                    movieTitle="Saiyaara"
                    rating={4}
                />
                <View style={styles.interactionWrapper}>
                    <InteractionBar 
                        initialLikes={1230}
                        initialComments={1230}
                        isLiked={false}
                        onLikePress={() => console.log('Liked Amogh post')}
                        onCommentPress={() => console.log('Comment on Amogh post')}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        paddingBottom: width * 0.08,
    },
    postContainer: {
        backgroundColor: '#FFF',
        paddingTop: width * 0.04,
    },
    interactionWrapper: {
        paddingHorizontal: width * 0.04,
        paddingBottom: width * 0.04,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 0,
    },
});