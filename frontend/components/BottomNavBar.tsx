import { View, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/BottomNavBar.styles";

export default function BottomNavBar() {
  const pathname = usePathname();
  const go = (to: string) => router.push(to);

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.item} onPress={() => go("/(tabs)/home")}>
        <MaterialIcons 
          name="home" 
          style={pathname.includes("home") ? styles.activeIcon : styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/(tabs)/movies")}>
        <MaterialIcons 
          name="confirmation-number" 
          style={pathname.includes("movies") ? styles.activeIcon : styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/(tabs)/post")}>
        <MaterialIcons name="add-circle" style={styles.postButton}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/(tabs)/events")}>
        <MaterialIcons 
          name="place" 
          style={pathname.includes("events") ? styles.activeIcon : styles.icon} 
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/(tabs)/profile")}>
        <MaterialIcons 
          name="account-circle" 
          style={pathname.includes("profile") ? styles.activeIcon : styles.icon} 
        />
      </TouchableOpacity>
    </View>
  );
}