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
        <MaterialIcons name="home" size={30} style={active("/") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/movies")}>
        <MaterialIcons name="confirmation-number" size={30} style={active("/movies") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/post")}>
        <MaterialIcons name="add-circle" size={50} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/events")}>
        <MaterialIcons name="place" size={30} style={active("/events") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go("/profile")}>
        <MaterialIcons name="account-circle" size={30} style={active("/profile") ? styles.activeIcon : styles.icon} />
      </TouchableOpacity>
    </View>
  );
};
