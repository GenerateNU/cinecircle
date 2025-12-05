// app/(auth)/splash.tsx  (or app/index.tsx if you want this as the very first screen)

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { Easing } from 'react-native'; // or from 'react-native' if you prefer

// 👇 Replace these with your real 12 PNG imports
const SLIDES: ImageSourcePropType[] = [
  require('../../assets/SplashScreen09.png'),
  require('../../assets/SplashScreen08.png'),
  require('../../assets/SplashScreen07.png'),
  require('../../assets/SplashScreen06.png'),
  require('../../assets/SplashScreen05.png'),
  require('../../assets/SplashScreen04.png'),
  require('../../assets/SplashScreen03.png'),
  require('../../assets/SplashScreen02.png'),
  require('../../assets/SplashScreen01.png'),
];

const FADE_DURATION_MS = 700; // how long each fade takes
const HOLD_DURATION_MS = 600; // how long each slide stays fully visible

export default function SplashSequenceScreen() {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      // show each slide one by one
      for (let i = 0; i < SLIDES.length; i++) {
        if (!isMounted) return;

        setIndex(i);
        opacity.setValue(0);

        // fade in
        await new Promise<void>(resolve => {
          Animated.timing(opacity, {
            toValue: 1,
            duration: FADE_DURATION_MS,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => resolve());
        });

        // hold fully visible
        await new Promise<void>(resolve =>
          setTimeout(resolve, HOLD_DURATION_MS)
        );
      }

      // done → go to welcome
      if (isMounted) {
        router.replace('/(auth)/welcome');
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      opacity.stopAnimation();
    };
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={SLIDES[index]}
        style={[
          styles.image,
          {
            width,
            height,
            opacity,
          },
        ]}
        resizeMode="cover" // or 'contain' depending on your Figma design
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // match your welcome screen bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // width/height are set dynamically from useWindowDimensions
  },
});
