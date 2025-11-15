import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, updateUserProfile } from '../../services/userService';

export default function Settings() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('South Asian cinema enthusiast 🎬 | SRK forever ❤️');
  const [whatsapp, setWhatsapp] = useState('+1 (555) 555-5555');
  const [photoUri, setPhotoUri] = useState('https://i.pravatar.cc/150?img=3');
  const [hasCustomPhoto, setHasCustomPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const HEADER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.2);
  const AVATAR_SIZE = 100;
  const AVATAR_RADIUS = AVATAR_SIZE / 2;

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      const username = res.userProfile?.username?.trim() || 'user';
      setDisplayName(username);
      const storedBio =
        res.userProfile?.favoriteMovies?.[0] ||
        'South Asian cinema enthusiast 🎬 | SRK forever ❤️';
      setBio(storedBio);
      const customPhoto = !!res.userProfile?.profilePicture;
      setHasCustomPhoto(customPhoto);
      const derivedUri =
        res.userProfile?.profilePicture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          username
        )}&size=200&background=667eea&color=fff`;
      setPhotoUri(derivedUri);
    } catch (err) {
      console.error('Failed to load profile settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  useEffect(() => {
    if (!hasCustomPhoto) {
      const name = displayName.trim() || 'user';
      setPhotoUri(
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&size=200&background=667eea&color=fff`
      );
    }
  }, [displayName, hasCustomPhoto]);

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const normalizedName = displayName.trim() || 'user';
      await updateUserProfile({
        username: normalizedName,
        favoriteMovies: bio.trim() ? [bio.trim()] : [],
      });
      if (!hasCustomPhoto) {
        setPhotoUri(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            normalizedName
          )}&size=200&background=667eea&color=fff`
        );
      }
      router.back();
    } catch (err) {
      console.error('Failed to update profile:', err);
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Header */}
        <View
          style={[
            tw`w-full`,
            { height: HEADER_HEIGHT, backgroundColor: '#E9EBEF' },
          ]}
        >
          <View style={tw`absolute inset-0 items-center justify-center`}>
            <TouchableOpacity
              style={tw`w-10 h-10 rounded-full bg-black bg-opacity-30 items-center justify-center`}
              onPress={() => {/* hook up background picker here */}}
            >
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center justify-between px-5 pt-6`}>
            <TouchableOpacity onPress={() => router.replace('/profilePage')} style={tw`px-2 py-2`}>
              <Ionicons name="chevron-back" size={24} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`px-3 py-2 rounded border`,
                {
                  backgroundColor: '#F7D5CD',
                  borderColor: '#D62E05',
                  borderWidth: 1,
                  opacity: saving ? 0.6 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={[tw`font-semibold`, { color: '#D62E05' }]}>
                {saving ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={tw`flex-1 items-center justify-center py-10`}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <>
            <View style={tw`px-5`}>
              <View
                style={[
                  tw`self-start`,
                  {
                    marginTop: -AVATAR_RADIUS,
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw`rounded-full items-center justify-center`,
                    {
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      borderRadius: AVATAR_RADIUS,
                    },
                  ]}
                  onPress={() => {/* hook up image picker here */}}
                >
                  <Image
                    source={{ uri: photoUri }}
                    style={{
                      width: AVATAR_SIZE,
                      height: AVATAR_SIZE,
                      borderRadius: AVATAR_RADIUS,
                    }}
                    resizeMode="cover"
                  />
                  <View
                    style={[
                      tw`absolute rounded-full items-center justify-center`,
                      {
                        top: 0,
                        left: 0,
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                      },
                    ]}
                  >
                    <Ionicons name="camera-outline" size={28} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Display Name Section */}
            <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
              <Text style={[tw`text-base font-semibold mb-2`, { color: '#D62E05' }]}>Display Name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
                style={[
                  tw`rounded-[6px] px-3 py-2`,
                  { borderWidth: 1, borderColor: '#D62E05' },
                ]}
              />
            </View>

            {/* Bio Section */}
            <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
              <Text style={[tw`text-base font-semibold mb-2`, { color: '#D62E05' }]}>Bio</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people about you"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={[
                  tw`rounded-[6px] px-3 py-2 h-28`,
                  { borderWidth: 1, borderColor: '#D62E05' },
                ]}
              />
            </View>

            {/* WhatsApp Section */}
            <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
              <Text style={[tw`text-base font-semibold mb-2`, { color: '#D62E05' }]}>WhatsApp Number</Text>
              <TextInput
                value={whatsapp}
                onChangeText={setWhatsapp}
                keyboardType="phone-pad"
                placeholder="+1 (___) ___-____"
                style={[
                  tw`rounded-[6px] px-3 py-2`,
                  { borderWidth: 1, borderColor: '#D62E05' },
                ]}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
