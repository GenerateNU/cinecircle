import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/BottomNavBar.styles';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="home" 
              style={focused ? styles.activeIcon : styles.icon}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="movies"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="confirmation-number" 
              style={focused ? styles.activeIcon : styles.icon}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: () => (
            <MaterialIcons 
              name="add-circle" 
              style={styles.postButton}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="events"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="place" 
              style={focused ? styles.activeIcon : styles.icon}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons 
              name="account-circle" 
              style={focused ? styles.activeIcon : styles.icon}
            />
          ),
        }}
      />
    </Tabs>
  );
}