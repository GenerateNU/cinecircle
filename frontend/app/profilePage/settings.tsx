import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';

export default function Settings() {
  const [displayName, setDisplayName] = useState('Kaamil Thobani');
  const [bio, setBio] = useState('South Asian cinema enthusiast 🎬 | SRK forever ❤️');
  const [whatsapp, setWhatsapp] = useState('+1 (555) 555-5555');
  const [photoUri, setPhotoUri] = useState('https://i.pravatar.cc/150?img=3');

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-10 px-5 pt-6`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`text-xl font-extrabold`}>Settings</Text>
          <TouchableOpacity onPress={() => router.back()} style={tw`px-3 py-2`}>
            <Text style={tw`text-base`}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View style={tw`w-[92%] self-center rounded-[8px] p-4 items-center mb-5`}>
          <Text style={tw`text-base font-semibold mb-3`}>Profile Picture</Text>
          <Image source={{ uri: photoUri }} style={tw`w-24 h-24 rounded-full mb-3`} />
          <TouchableOpacity
            style={tw`border border-black px-4 py-2 rounded-[6px]`}
            onPress={() => {/* hook up image picker here */}}
          >
            <Text style={tw`font-semibold`}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Display Name Section */}
        <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
          <Text style={tw`text-base font-semibold mb-2`}>Display Name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your display name"
            style={tw`border border-black rounded-[6px] px-3 py-2`}
          />
        </View>

        {/* Bio Section */}
        <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
          <Text style={tw`text-base font-semibold mb-2`}>Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people about you"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={tw`border border-black rounded-[6px] px-3 py-2 h-28`}
          />
        </View>

        {/* WhatsApp Section */}
        <View style={tw`w-[92%] self-center rounded-[8px] p-4 mb-5`}>
          <Text style={tw`text-base font-semibold mb-2`}>WhatsApp Number</Text>
          <TextInput
            value={whatsapp}
            onChangeText={setWhatsapp}
            keyboardType="phone-pad"
            placeholder="+1 (___) ___-____"
            style={tw`border border-black rounded-[6px] px-3 py-2`}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={tw`w-[92%] self-center bg-black rounded-[8px] px-4 py-3 mt-2`}
          onPress={() => {
            // Wire up saving logic as needed
            router.back();
          }}
        >
          <Text style={tw`text-white text-center font-semibold`}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
