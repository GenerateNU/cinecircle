import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';

const { width } = Dimensions.get('window');

type Tab = {
  key: string;
  label: string;
};

type TabToggleProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeColor?: string;
  inactiveColor?: string;
  indicatorColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function TabToggle({
  tabs,
  activeTab,
  onTabChange,
  activeColor = '#000',
  inactiveColor = '#666',
  indicatorColor = '#007AFF',
  containerStyle,
}: TabToggleProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && { borderBottomColor: indicatorColor },
          ]}
          onPress={() => onTabChange(tab.key)}
        >
          <Text
            style={[
              styles.tabText,
              { color: inactiveColor },
              activeTab === tab.key && { color: activeColor, fontWeight: '600' },
            ]}
          >
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
  tabText: {
    fontSize: width * 0.036,
    fontWeight: '500',
    color: '#666',
  },
});
