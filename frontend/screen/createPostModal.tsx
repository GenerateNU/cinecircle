import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Image } from "react-native";
import Review from "../assets/review.png"
import shortPost from "../assets/short-take.png"

interface Props {
  onSelect: (type: "short" | "long") => void;
  onClose: () => void;
}

export default function CreatePostModal({ onSelect, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.title}>Create</Text>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => onSelect("short")}>
            <Image 
              source={shortPost}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSelect("long")}>
            <Image 
              source={Review}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Take</Text>
          <Text style={styles.label}>Review</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 24,
    minHeight: 380,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 18,
  },
  ticketText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c45c48",
  },
  label: {
    width: 140,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
});
