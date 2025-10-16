import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = Partial<NativeStackScreenProps<RootStackParamList, 'Profile'>> & {
  user?: {
    name: string;
    username: string;
    bio?: string;
    followers?: number;
    following?: number;
    profilePic?: string;
  };
};

const ProfilePage = ({ navigation, user }: Props) => {
  const internalNav =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const nav = navigation ?? internalNav;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <Text style={styles.text}>🎞️ SRK Fan | CineCircle Member</Text>

        <TouchableOpacity
          style={styles.postButton}
          onPress={() => nav.navigate('Post')}
        >
          <Text style={styles.postButtonText}>➕ Create a Post</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  header: { padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  text: { textAlign: 'center', fontSize: 16 },
  postButton: {
    backgroundColor: '#000',
    padding: 12,
    margin: 20,
    borderRadius: 8,
  },
  postButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
