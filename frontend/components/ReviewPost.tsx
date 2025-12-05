import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import UserBar from './UserBar';
import StarRating from './StarRating';
import { getMoviePosterUrl } from '../services/imageService';

const { width } = Dimensions.get('window');

type ReviewPostProps = {
  userName: string;
  username: string;
  date: string;
  avatarUri?: string;
  reviewerName: string;
  reviewerAvatarUri?: string;
  movieTitle: string;
  rating?: number;
  userId?: string;
  reviewerUserId?: string;
  movieImageUrl: string;
  onPress?: () => void;
  /** If true, show a 'Spoiler' badge on the card */
  spoiler?: boolean;
};

export default function ReviewPost({
  userName,
  username,
  date,
  avatarUri,
  reviewerName,
  reviewerAvatarUri,
  movieTitle,
  rating = 5,
  userId,
  reviewerUserId,
  movieImageUrl,
  onPress,
  spoiler = false,
}: ReviewPostProps) {
  // Get the full TMDB image URL using the image service
  const imageUrl = movieImageUrl ? getMoviePosterUrl(movieImageUrl) : null;
  const hasValidImage = !!imageUrl;

  const content = (
    <View style={styles.container}>
      {hasValidImage ? (
        <ImageBackground
          source={{ uri: imageUrl as string }}
          style={styles.imageBackground}
          imageStyle={styles.image}
          resizeMode="cover"
        >
          {/* Top overlay row (spoiler badge, etc.) */}
          <View style={styles.topOverlayRow}>
            {spoiler && (
              <View style={styles.spoilerPill}>
                <Text style={styles.spoilerText}>Spoiler</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomContainer}>
            <MaskedView
              style={styles.maskedView}
              maskElement={
                <LinearGradient
                  colors={['transparent', 'white']}
                  locations={[0, 0.7]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                />
              }
            >
              <Image
                source={{ uri: imageUrl as string }}
                style={StyleSheet.absoluteFill}
                blurRadius={30}
                resizeMode="cover"
              />
            </MaskedView>
            <View style={styles.contentContainer}>
              <UserBar
                name={reviewerName}
                avatarUri={reviewerAvatarUri}
                avatarSize={width * 0.08}
                userId={reviewerUserId}
                nameColor="#FFFFFF"
              />
              <Text style={styles.movieTitle}>{movieTitle}</Text>
              <View style={styles.ratingContainer}>
                <StarRating maxStars={5} rating={rating} />
              </View>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <View style={[styles.imageBackground, styles.fallbackBackground]}>
          {/* Top overlay row (spoiler badge, etc.) */}
          <View style={styles.topOverlayRow}>
            {spoiler && (
              <View style={styles.spoilerPill}>
                <Text style={styles.spoilerText}>Spoiler</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.contentContainer}>
              <UserBar
                name={reviewerName}
                avatarUri={reviewerAvatarUri}
                avatarSize={width * 0.08}
                userId={reviewerUserId}
                nameColor="#FFFFFF"
              />
              <Text style={styles.movieTitle}>{movieTitle}</Text>
              <View style={styles.ratingContainer}>
                <StarRating maxStars={5} rating={rating} />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: width * 0.03,
    overflow: 'hidden',
    backgroundColor: '#000',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 8,
  },
  imageBackground: {
    width: '100%',
    minHeight: width * 0.8,
    justifyContent: 'flex-end',
  },
  image: {
    borderRadius: width * 0.03,
  },
  fallbackBackground: {
    backgroundColor: '#1a1a1a',
  },
  // row at the top of the card where the spoiler pill sits
  topOverlayRow: {
    position: 'absolute',
    top: width * 0.03,
    right: width * 0.03,
    left: width * 0.03,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  spoilerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderColor: '#F5C518', // IMDb-ish yellow accent
  },
  spoilerText: {
    color: '#F5C518',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  maskedView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: width * 0.6,
  },
  contentContainer: {
    padding: width * 0.04,
    paddingBottom: width * 0.05,
  },
  movieTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: width * 0.03,
    marginBottom: width * 0.02,
    flexShrink: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  ratingContainer: {
    marginTop: width * 0.01,
    alignItems: 'flex-start',
  },
});
