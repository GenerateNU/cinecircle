// frontend/app/components/TextPost.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import UserBar from './UserBar';
import { translateTextApi } from '../services/translationService';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

function mapPrimaryLanguage(primaryLanguage?: string | null): {
  code: string;
  label: string;
} {
  if (!primaryLanguage) return { code: 'en', label: 'English' };

  const lower = primaryLanguage.toLowerCase().trim();

  switch (lower) {
    case 'hindi':
      return { code: 'hi', label: 'Hindi' };
    case 'tamil':
      return { code: 'ta', label: 'Tamil' };
    case 'telugu':
      return { code: 'te', label: 'Telugu' };
    case 'bengali':
    case 'bangla':
      return { code: 'bn', label: 'Bengali' };
    case 'english':
    case 'en':
      return { code: 'en', label: 'English' };
    default:
      return { code: 'en', label: primaryLanguage };
  }
}

type TextPostProps = {
  userName: string;
  username: string;
  date: string;
  avatarUri?: string;
  content: string;
  userId?: string;
  spoiler?: boolean;
};

export default function TextPost({
  userName,
  username,
  date,
  avatarUri,
  content,
  userId,
  spoiler = false,
}: TextPostProps) {
  const { profile } = useAuth();

  const mapped = mapPrimaryLanguage((profile as any)?.primaryLanguage);
  const userLangCode = mapped.code;

  const [isTranslated, setIsTranslated] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const shouldShowTranslate = userLangCode !== 'en';

  console.log(
    '[TextPost] RENDER: langRaw =',
    (profile as any)?.primaryLanguage
  );
  console.log('[TextPost] mapped lang =', mapped);
  console.log('[TextPost] shouldShowTranslate =', shouldShowTranslate);

  const textToShow = isTranslated && translated ? translated : content;

  const toggleTranslation = async () => {
    console.log('=== [TextPost] toggleTranslation pressed ===', {
      isTranslated,
      hasTranslated: !!translated,
    });

    const turningOn = !isTranslated;

    if (turningOn && shouldShowTranslate && !translated) {
      try {
        setLoadingTranslation(true);

        console.log('[TextPost] Calling translateTextApi with:', {
          textSnippet: content.slice(0, 80),
          dest: userLangCode,
        });

        const response = await translateTextApi(content, userLangCode, 'en');
        console.log('[TextPost] translateTextApi response =', response);

        const translatedText = response.destinationText || content;
        setTranslated(translatedText);
      } catch (err) {
        console.error('[TextPost] Translation ERROR:', err);
        setTranslated(null);
      } finally {
        setLoadingTranslation(false);
      }
    }

    setIsTranslated(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {spoiler && (
        <View style={styles.spoilerPill}>
          <Text style={styles.spoilerText}>Spoiler</Text>
        </View>
      )}

      <UserBar
        name={userName}
        username={username}
        date={date}
        avatarUri={avatarUri}
        userId={userId}
        showTranslate={shouldShowTranslate}
        onPressTranslate={toggleTranslation}
        loadingTranslate={loadingTranslation}
      />

      <Text style={styles.content}>{textToShow}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    width: '100%',
    position: 'relative',
  },
  content: {
    fontSize: width * 0.0375,
    color: '#000',
    lineHeight: width * 0.05,
    marginTop: width * 0.03,
    flexShrink: 1,
  },
  spoilerPill: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.035,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderColor: '#F5C518',
    zIndex: 2,
  },
  spoilerText: {
    color: '#F5C518',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
