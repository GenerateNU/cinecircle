import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/UserLike.styles';

interface UserLikeProps {
  name: string;
}

export default function UserLike({ name }: UserLikeProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="favorite" style={styles.icon} />
      <Text style={styles.text}>{name} loved</Text>
    </View>
  );
}
