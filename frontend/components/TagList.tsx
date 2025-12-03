import { StyleSheet, ScrollView } from 'react-native';
import Tag from './Tag';

type TagListProps = {
  tags: string[];
  variant?: 'default' | 'blue';
};

export default function TagList({ tags, variant = 'default' }: TagListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tags.map((tag, index) => (
        <Tag key={index} label={tag} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#333',
  },
});
