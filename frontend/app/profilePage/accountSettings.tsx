import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles as bottomNavStyles } from '../../styles/BottomNavBar.styles';
import { deleteUserProfile, getUserProfile, updateUserProfile } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

type SectionKey = 'personal' | 'privacy' | 'language';

const sections: Array<{
  key: SectionKey;
  title: string;
  items: string[];
}> = [
  {
    key: 'personal',
    title: 'Personal Details',
    items: ['Name, email, phone', 'Password', 'Recovery options'],
  },
  {
    key: 'privacy',
    title: 'Privacy',
    items: ['Profile visibility', 'Blocked users', 'Data downloads'],
  },
  {
    key: 'language',
    title: 'Language',
    items: ['App language', 'Preferred subtitles', 'Region formats'],
  },
];

export default function AccountSettings() {
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [privateAccount, setPrivateAccount] = useState(false);
  const [allowSpoilers, setAllowSpoilers] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const isBusy = isSaving || isLoading;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const res = await getUserProfile();
        try {
          console.log(
            '[AccountSettings] loaded profile payload:',
            JSON.stringify(res, null, 2),
          );
        } catch {
          console.log('[AccountSettings] loaded profile payload (raw):', res);
        }
        if (res?.userProfile) {
          setUsername(res.userProfile.username ?? '');
          setSelectedLanguages(res.userProfile.secondaryLanguage ?? []);
          setPrivateAccount(Boolean(res.userProfile.privateAccount));
          setAllowSpoilers(Boolean(res.userProfile.spoiler));
        }
      } catch (err) {
        console.error('Failed to load user profile', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const toggle = (key: SectionKey) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const handleSavePersonal = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please ensure both passwords are identical.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateUserProfile({
        username,
        secondaryLanguage: selectedLanguages,
        privateAccount,
        spoiler: allowSpoilers,
      });
      if (res?.data) {
        setUsername(res.data.username ?? '');
        setPrivateAccount(Boolean(res.data.privateAccount));
        setAllowSpoilers(Boolean(res.data.spoiler));
        setSelectedLanguages(res.data.secondaryLanguage ?? []);
      }
      Alert.alert('Saved', 'Personal details have been saved.');
    } catch (err) {
      console.error('Failed to save personal details', err);
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputBorder = { borderColor: '#AB2504', borderWidth: 1 };
  const languageOptions = [
    'English',
    'Hindi',
    'Urdu',
    'Punjabi',
    'Tamil',
    'Telugu',
    'Gujarati',
    'Bengali',
    'Malayalam',
    'Marathi',
  ];

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSaveLanguages = async () => {
    try {
      setIsSaving(true);
      const res = await updateUserProfile({
        username,
        secondaryLanguage: selectedLanguages,
        privateAccount,
        spoiler: allowSpoilers,
      });
      if (res?.data) {
        setUsername(res.data.username ?? '');
        setPrivateAccount(Boolean(res.data.privateAccount));
        setAllowSpoilers(Boolean(res.data.spoiler));
        setSelectedLanguages(res.data.secondaryLanguage ?? []);
      }
      Alert.alert('Saved', 'Language preferences have been saved.');
    } catch (err) {
      console.error('Failed to save languages', err);
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setIsSaving(true);
      const res = await updateUserProfile({
        username,
        secondaryLanguage: selectedLanguages,
        privateAccount,
        spoiler: allowSpoilers,
      });
      if (res?.data) {
        setUsername(res.data.username ?? '');
        setPrivateAccount(Boolean(res.data.privateAccount));
        setAllowSpoilers(Boolean(res.data.spoiler));
      }
      Alert.alert('Saved', 'Privacy preferences have been saved.');
    } catch (err) {
      console.error('Failed to save privacy settings', err);
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete profile?',
      'This will permanently delete your profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserProfile();
              await signOut();
              router.replace('/(auth)/welcome');
            } catch (err) {
              console.error('Failed to delete profile', err);
              Alert.alert('Unable to delete profile', 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/welcome');
    } catch (err) {
      console.error('Failed to log out', err);
      Alert.alert('Unable to log out', 'Please try again.');
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 110,
        }}
      >
        {/* Header */}
        <View
          style={[
            tw`px-5 pb-4`,
            { paddingTop: Math.max(insets.top + 8, 20) },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) navigation.goBack();
                else router.push('/(tabs)/profile');
              }}
              style={tw`px-2 py-2`}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={24} color="#111" />
            </TouchableOpacity>
            <Text style={tw`text-xl font-bold text-black`}>
              Account Settings
            </Text>
            <View style={tw`w-8`} />
          </View>

          <Text style={tw`text-gray-600`}>
            Manage your account preferences below.
          </Text>
        </View>

        {/* Sections */}
        <View style={tw`px-5`}>
          {sections.map((section) => {
            const isOpen = openSection === section.key;
            return (
              <View key={section.key} style={tw`mb-1`}>
                <TouchableOpacity
                  style={[
                    tw`flex-row items-center justify-between px-4 py-4`,
                    { borderTopWidth: 1, borderTopColor: '#E2E4E9' },
                  ]}
                  onPress={() => toggle(section.key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle ${section.title}`}
                >
                  <Text style={tw`text-base font-semibold text-black`}>
                    {section.title}
                  </Text>
                  <Ionicons
                    name={isOpen ? 'chevron-down' : 'chevron-forward'}
                    size={20}
                    color="#111"
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={tw`px-4 pb-4`}>
                    {section.key === 'personal' ? (
                      <View>
                        <View style={tw`mb-3`}>
                          <Text style={tw`text-xs text-gray-700 mb-1`}>Username</Text>
                          <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                            style={[
                              tw`rounded-md px-3 py-2`,
                              inputBorder,
                            ]}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        <View style={tw`mb-3`}>
                          <Text style={tw`text-xs text-gray-700 mb-1`}>Email</Text>
                          <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter email"
                            style={[
                              tw`rounded-md px-3 py-2`,
                              inputBorder,
                            ]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        <View style={tw`mb-3`}>
                          <Text style={tw`text-xs text-gray-700 mb-1`}>Password</Text>
                          <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            secureTextEntry
                            style={[
                              tw`rounded-md px-3 py-2`,
                              inputBorder,
                            ]}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        {password.length > 0 && (
                          <View style={tw`mb-3`}>
                            <Text style={tw`text-xs text-gray-700 mb-1`}>Confirm password</Text>
                            <TextInput
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                              placeholder="Confirm password"
                              secureTextEntry
                              style={[
                                tw`rounded-md px-3 py-2`,
                                inputBorder,
                              ]}
                              placeholderTextColor="#9ca3af"
                            />
                          </View>
                        )}
                        <TouchableOpacity
                          onPress={handleSavePersonal}
                          disabled={isBusy}
                          style={[
                            tw`self-start px-3 py-2 rounded border`,
                            {
                              backgroundColor: '#F7D5CD',
                              borderColor: '#D62E05',
                              borderWidth: 1,
                              opacity: isBusy ? 0.7 : 1,
                            },
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Save personal details"
                        >
                          <Text style={[tw`font-semibold`, { color: '#D62E05' }]}>
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : section.key === 'privacy' ? (
                      <View>
                        {[
                          {
                            key: 'private',
                            title: 'Private Account',
                            desc: 'Control who can see your profile and posts. Only approved followers will have access.',
                            value: privateAccount,
                            setter: setPrivateAccount,
                          },
                          {
                            key: 'spoilers',
                            title: 'Allow Spoilers',
                            desc: 'Show all posts including posts that may contain spoilers.',
                            value: allowSpoilers,
                            setter: setAllowSpoilers,
                          },
                        ].map((item) => (
                          <View
                            key={item.key}
                            style={tw`py-3 border-t border-gray-200`}
                          >
                            <View style={tw`flex-row items-center justify-between`}>
                              <Text style={tw`text-base font-semibold text-black`}>
                                {item.title}
                              </Text>
                              <Switch
                                value={item.value}
                                onValueChange={item.setter}
                                trackColor={{ false: '#F7D5CD', true: '#D62E05' }}
                                thumbColor="#ffffff"
                                ios_backgroundColor="#F7D5CD"
                              />
                            </View>
                            <Text style={tw`text-sm text-gray-600 mt-1`}>
                              {item.desc}
                            </Text>
                          </View>
                        ))}
                        <TouchableOpacity
                          onPress={handleSavePrivacy}
                          disabled={isBusy}
                          style={[
                            tw`self-start mt-2 px-3 py-2 rounded border`,
                            {
                              backgroundColor: '#F7D5CD',
                              borderColor: '#D62E05',
                              borderWidth: 1,
                              opacity: isBusy ? 0.7 : 1,
                            },
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Save privacy settings"
                        >
                          <Text style={[tw`font-semibold`, { color: '#D62E05' }]}>
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : section.key === 'language' ? (
                      <View>
                        <View
                          style={tw`flex-row flex-wrap -mx-1`}
                        >
                          {languageOptions.map((lang) => {
                            const isSelected = selectedLanguages.includes(lang);
                            return (
                              <TouchableOpacity
                                key={lang}
                                onPress={() => toggleLanguage(lang)}
                                style={[
                                  tw`px-3 py-2 m-1 rounded-full`,
                                  {
                                    borderRadius: 999,
                                    borderWidth: 1,
                                    borderColor: isSelected ? '#D62E05' : '#16737C',
                                    backgroundColor: isSelected ? '#F7D5CD' : '#D1E9EB',
                                  },
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={`Select ${lang}`}
                              >
                                <Text
                                  style={{
                                    color: isSelected ? '#D62E05' : '#16737C',
                                    fontWeight: '600',
                                  }}
                                >
                                  {lang}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                        <TouchableOpacity
                          onPress={handleSaveLanguages}
                          disabled={isBusy}
                          style={[
                            tw`self-start mt-4 px-3 py-2 rounded border`,
                            {
                              backgroundColor: '#F7D5CD',
                              borderColor: '#D62E05',
                              borderWidth: 1,
                              opacity: isBusy ? 0.7 : 1,
                            },
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel="Save language preferences"
                        >
                          <Text style={[tw`font-semibold`, { color: '#D62E05' }]}>
                            Save
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      section.items.map((item) => (
                        <View
                          key={item}
                          style={tw`flex-row items-center py-2 border-t border-gray-200`}
                        >
                          <Ionicons name="ellipse" size={6} color="#D62E05" />
                          <Text style={tw`ml-3 text-gray-700`}>{item}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Danger / auth actions */}
        <View style={tw`px-5 mt-6 mb-12`}>
          <TouchableOpacity
            onPress={handleDeleteProfile}
            style={[
              tw`self-center w-11/12 px-3 py-3 rounded border`,
              {
                borderRadius: 12,
                backgroundColor: '#F7D5CD',
                borderColor: '#D62E05',
                borderWidth: 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Delete profile"
          >
            <Text style={[tw`font-semibold text-center`, { color: '#D62E05' }]}>
              Delete Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[
              tw`self-center w-11/12 px-3 py-3 rounded border mt-3`,
              {
                borderRadius: 12,
                backgroundColor: '#F7D5CD',
                borderColor: '#D62E05',
                borderWidth: 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Log out"
          >
            <Text style={[tw`font-semibold text-center`, { color: '#D62E05' }]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom nav */}
      <View
        style={[
          bottomNavStyles.bar,
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {[
          { route: '/(tabs)/home', icon: 'home' as const, label: 'Home' },
          { route: '/(tabs)/movies', icon: 'confirmation-number' as const, label: 'Movies' },
          { route: '/(tabs)/post', icon: 'add-circle' as const, label: 'Create post' },
          { route: '/(tabs)/events', icon: 'place' as const, label: 'Events' },
          { route: '/(tabs)/profile', icon: 'account-circle' as const, label: 'Profile' },
        ].map((item) => {
          const isActive = item.route === '/(tabs)/profile';
          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.navigate(item.route)}
              style={[bottomNavStyles.item, { overflow: 'visible' }]}
              accessibilityRole="button"
              accessibilityLabel={`Go to ${item.label}`}
            >
              <MaterialIcons
                name={item.icon}
                style={isActive ? bottomNavStyles.activeIcon : bottomNavStyles.icon}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
