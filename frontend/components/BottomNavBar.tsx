// components/BottomNavBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';

export default function BottomNavBar() {
  const pathname = usePathname();

  const go = (to: string) => {
    // use replace for tab-like behavior (no stacking duplicates)
    router.replace(to);
  };

  const active = (to: string) => pathname === to;

  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.item} onPress={() => go('/')}>
        <Text style={[styles.icon, active('/') && styles.active]}>🏠</Text>
        <Text style={[styles.label, active('/') && styles.active]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go('/post')}>
        <Text style={[styles.icon, active('/post') && styles.active]}>✍️</Text>
        <Text style={[styles.label, active('/post') && styles.active]}>
          Post
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go('/profile')}>
        <Text style={[styles.icon, active('/profile') && styles.active]}>
          👤
        </Text>
        <Text style={[styles.label, active('/profile') && styles.active]}>
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go('/movies')}>
        <Text style={[styles.icon, active('/movies') && styles.active]}>
          🎞️
        </Text>
        <Text style={[styles.label, active('/movies') && styles.active]}>
          Movies
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => go('/events')}>
        <Text style={[styles.icon, active('/events') && styles.active]}>
          👤👤
        </Text>
        <Text style={[styles.label, active('/events') && styles.active]}>
          Events
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
    paddingBottom: 10, paddingTop: 8,
    justifyContent: 'space-around',
  },
  item: { alignItems: 'center' },
  icon: { fontSize: 20, color: '#777' },
  label: { fontSize: 12, color: '#777', marginTop: 2 },
  active: { color: '#000', fontWeight: '600' },
});
