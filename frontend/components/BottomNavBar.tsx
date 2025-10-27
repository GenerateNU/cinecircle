// components/BottomNavBar.tsx
import React from 'react';
import { View, Text, Pressable, PressableStateCallbackType } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

type WebPressableState = PressableStateCallbackType & { hovered?: boolean };

const COLORS = {
  icon: '#EBCCE1',
  active: '#9A0169',
  postBg: '#EBCCE1',
  white: '#FFFFFF',
};

export default function BottomNavBar() {
  const pathname = usePathname();
  const go = (to: string) => router.replace(to);
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <View
      style={tw`absolute left-0 right-0 bottom-0 flex-row bg-white border-t border-[#eee] pb-[10px] pt-[8px] justify-around items-center`}
    >
      {/* Home */}
      <Pressable
        style={[tw`items-center justify-center gap-2`, { minWidth: 60 }]}
        accessibilityRole="button"
        accessibilityLabel="Home"
        onPress={() => go('/')}
      >
        {(state: WebPressableState) => {
          const { hovered, pressed } = state;
          const active = isActive('/') || pressed || hovered;
          return (
            <>
              <Ionicons
                name="home-outline"
                size={22}
                color={active ? COLORS.active : COLORS.icon}
              />
              <Text
                style={[
                  tw`text-[11px]`,
                  active ? tw`text-[#9A0169] font-semibold` : tw`text-[#EBCCE1]`,
                ]}
              >
                Home
              </Text>
            </>
          );
        }}
      </Pressable>

      {/* Movies */}
      <Pressable
        style={[tw`items-center justify-center gap-2`, { minWidth: 60 }]}
        accessibilityRole="button"
        accessibilityLabel="Movies"
        onPress={() => go('/movies')}
      >
        {(state: WebPressableState) => {
          const { hovered, pressed } = state;
          const active = isActive('/movies') || pressed || hovered;
          return (
            <>
              <Ionicons
                name="ticket-outline"
                size={22}
                color={active ? COLORS.active : COLORS.icon}
              />
              <Text
                style={[
                  tw`text-[11px]`,
                  active ? tw`text-[#9A0169] font-semibold` : tw`text-[#EBCCE1]`,
                ]}
              >
                Movies
              </Text>
            </>
          );
        }}
      </Pressable>

      {/* Post */}
      <Pressable
        style={[tw`items-center justify-center`, { minWidth: 60, marginBottom: 8 }]}
        accessibilityRole="button"
        accessibilityLabel="Create Post"
        onPress={() => go('/post')}
      >
        {(state: WebPressableState) => {
          const { hovered, pressed } = state;
          const active = isActive('/post') || pressed || hovered;
          return (
            <View
              style={[
                tw`items-center justify-center rounded-full`,
                active ? tw`bg-[#9A0169]` : tw`bg-[#EBCCE1]`,
                { width: 44, height: 44 },
                // subtle shadow
                {
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 2,
                },
              ]}
            >
              <Ionicons name="add" size={22} color={COLORS.white} />
            </View>
          );
        }}
      </Pressable>

      {/* Events */}
      <Pressable
        style={[tw`items-center justify-center gap-2`, { minWidth: 60 }]}
        accessibilityRole="button"
        accessibilityLabel="Events"
        onPress={() => go('/events')}
      >
        {(state: WebPressableState) => {
          const { hovered, pressed } = state;
          const active = isActive('/events') || pressed || hovered;
          return (
            <>
              <Ionicons
                name="location-outline"
                size={22}
                color={active ? COLORS.active : COLORS.icon}
              />
              <Text
                style={[
                  tw`text-[11px]`,
                  active ? tw`text-[#9A0169] font-semibold` : tw`text-[#EBCCE1]`,
                ]}
              >
                Events
              </Text>
            </>
          );
        }}
      </Pressable>

      {/* Profile */}
      <Pressable
        style={[tw`items-center justify-center gap-2`, { minWidth: 60 }]}
        accessibilityRole="button"
        accessibilityLabel="Profile"
        onPress={() => go('/profile')}
      >
        {(state: WebPressableState) => {
          const { hovered, pressed } = state;
          const active = isActive('/profilePage') || pressed || hovered;
          return (
            <>
              <Ionicons
                name="person-outline"
                size={22}
                color={active ? COLORS.active : COLORS.icon}
              />
              <Text
                style={[
                  tw`text-[11px]`,
                  active ? tw`text-[#9A0169] font-semibold` : tw`text-[#EBCCE1]`,
                ]}
              >
                Profile
              </Text>
            </>
          );
        }}
      </Pressable>
    </View>
  );
}
