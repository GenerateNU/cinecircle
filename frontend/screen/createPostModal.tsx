import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";

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
      {/* Tap outside to close */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        <Text style={styles.title}>Create</Text>

        <View style={styles.row}>
          {/* SHORT TAKE BUTTON */}
          <TouchableOpacity style={styles.ticket} onPress={() => onSelect("short")}>
            <Text style={styles.ticketText}>Short Take</Text>
          </TouchableOpacity>

          {/* REVIEW BUTTON */}
          <TouchableOpacity style={styles.ticket} onPress={() => onSelect("long")}>
            <Text style={styles.ticketText}>Review</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Labels */}
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
  ticket: {
    width: 140,
    height: 85,
    backgroundColor: "#ffd8d2", // light coral
    borderWidth: 2,
    borderColor: "#e08a78",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
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
