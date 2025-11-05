import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type TabToggleProps = {
  activeTab: 'forYou' | 'recByFriends';
  onTabChange: (tab: 'forYou' | 'recByFriends') => void;
};

export default function TabToggle({ activeTab, onTabChange }: TabToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'forYou' && styles.activeTab
        ]}
        onPress={() => onTabChange('forYou')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'forYou' && styles.activeTabText
        ]}>
          For You
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'recByFriends' && styles.activeTab
        ]}
        onPress={() => onTabChange('recByFriends')}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'recByFriends' && styles.activeTabText
        ]}>
          Recommended by friends
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.04,
    paddingTop: width * 0.02,
    paddingBottom: width * 0.03,
    backgroundColor: '#FFF',
  },
  tab: {
    flex: 1,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
});