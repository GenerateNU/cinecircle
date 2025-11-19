import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/BottomNavBar.styles';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="movies" />
      <Tabs.Screen name="post" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const iconNames = ['home', 'confirmation-number', 'add-circle', 'place', 'account-circle'];
  
  return (
    <View style={styles.bar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isPostButton = route.name === 'post';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.item, { overflow: 'visible' }]}
          >
            <MaterialIcons
              name={iconNames[index] as any}
              style={
                isPostButton
                  ? styles.postButton
                  : isFocused
                  ? styles.activeIcon
                  : styles.icon
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}