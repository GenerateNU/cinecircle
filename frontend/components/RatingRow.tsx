import { View, Text, StyleSheet } from 'react-native';
import StarRating from './StarRating';

type RatingRowProps = {
  label: string;
  rating: number; // 0-5
  size?: 16 | 24; // Star size
};

export default function RatingRow({
  label,
  rating,
  size = 24,
}: RatingRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <StarRating rating={rating} maxStars={5} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
