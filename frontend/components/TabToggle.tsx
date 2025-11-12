import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type Tab = {
  key: string;
  label: string;
};

type TabToggleProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function TabToggle({ tabs, activeTab, onTabChange }: TabToggleProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
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