import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import MyCarousel from "./Carousel";

interface CarouselPostProps {
  profilePic: string;
  name: string;
  username: string;
  date: string;
  carouselComponents: React.ReactNode[];
}

export default function CarouselPost({
  profilePic,
  name,
  username,
  date,
  carouselComponents,
}: CarouselPostProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <MyCarousel
          components={carouselComponents}
          width={90}  
          height={25} 
        />
      </View>

      <View style={styles.interactionBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    width: "100%",
    alignSelf: "stretch",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 24,
    marginRight: 8,
    backgroundColor: "pink",
  },
  userInfo: {
    flexDirection: "column",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginRight: 4,
  },
  username: {
    color: "#555",
    fontSize: 14,
    marginRight: 4,
  },
  dot: {
    color: "#999",
    fontSize: 14,
    marginRight: 4,
  },
  date: {
    color: "#555",
    fontSize: 14,
  },
  carouselWrapper: {
    overflow: "hidden",
    alignItems: "center",  
    justifyContent: "center",
  },
  interactionBar: {
    marginTop: 8,
    height: 32,
    borderRadius: 8,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "pink",
  },
});
