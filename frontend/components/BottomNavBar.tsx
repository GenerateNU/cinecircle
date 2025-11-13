import React from "react";
import { View, TouchableOpacity } from "react-native";
import { router, usePathname } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/BottomNavBar.styles";

export default function BottomNavBar() {
  const pathname = usePathname();
  const go = (to: string) => router.replace(to);
  const active = (to: string) => pathname === to;

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.item} onPress={() => go("/")}>
        <MaterialIcons name="home" style={active("/") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/movies")}>
        <MaterialIcons name="confirmation-number" style={active("/movies") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/post")}>
        <MaterialIcons name="add-circle" style={styles.postButton}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/events")}>
        <MaterialIcons name="place" style={active("/events") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/profile")}>
        <MaterialIcons name="account-circle" style={active("/profile") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>
    </View>
  );
}
