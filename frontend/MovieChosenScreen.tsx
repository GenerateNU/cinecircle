import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import SearchBar from './components/SearchBar';
import RatingRow from './components/RatingRow';
import TagList from './components/TagList';
import ActionButtons from './components/ActionButtons';
import ReviewCard from './components/ReviewCard';

export default function MovieChosenScreen() {
    const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');

    return (
        <ScrollView style={styles.container}>
            {/* Search Bar */}
            <SearchBar />

            {/* Movie Title */}
            <Text style={styles.title}>Movie Title</Text>

            {/* Metadata */}
            <View style={styles.metaContainer}>
                <Text style={styles.metaText}>2025 • Directed by: Emily Chooi</Text>
                <Text style={styles.genreText}>Genre • Genre • Genre • Genre • Genre</Text>
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            </Text>

            {/* Tags */}
            <TagList tags={['Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1']} />

            {/* Ratings */}
            <View style={styles.ratingsContainer}>
                <RatingRow label="Overall" rating={0} />
                <RatingRow label="Rotten Tomatoes" rating={0} />
                <RatingRow label="IBM" rating={0} />
            </View>

            {/* Action Buttons */}
            <ActionButtons />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
                    onPress={() => setActiveTab('reviews')}
                >
                    <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
                        Reviews
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'comments' && styles.activeTab]}
                    onPress={() => setActiveTab('comments')}
                >
                    <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
                        Comments
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                {activeTab === 'reviews' ? (
                    <>
                        <ReviewCard />
                        <ReviewCard />
                    </>
                ) : (
                    <Text style={styles.placeholderText}>Comments coming soon...</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
    },
    metaContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
    },
    genreText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#333',
    },
    ratingsContainer: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 16,
        color: '#999',
    },
    activeTabText: {
        color: '#000',
        fontWeight: '600',
    },
    contentContainer: {
        padding: 16,
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 32,
    },
});