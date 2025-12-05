// app/(auth)/splash.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { Easing } from 'react-native';

const SLIDES: ImageSourcePropType[] = [
  require('../assets/SplashScreen09.png'),
  require('../assets/SplashScreen08.png'),
  require('../assets/SplashScreen07.png'),
  require('../assets/SplashScreen06.png'),
  require('../assets/SplashScreen05.png'),
  require('../assets/SplashScreen04.png'),
  require('../assets/SplashScreen03.png'),
  require('../assets/SplashScreen02.png'),
  // add the remaining up to 12 if you have them
];

const FADE_DURATION_MS = 700;
const HOLD_DURATION_MS = 600;
const FINAL_HOLD_MS = 500;
// how many slides at the **end** should slide horizontally instead of fading
const SLIDING_COUNT = 1; // last 3 slides will slide; change as you like

export default function SplashSequenceScreen() {
  const { width, height } = useWindowDimensions();

  // the slide currently visible underneath
  const [baseIndex, setBaseIndex] = useState(0);
  // the slide we are fading/sliding in on top
  const [frontIndex, setFrontIndex] = useState(0);
  // are we in the sliding phase (last few slides)?
  const [isSlidingPhase, setIsSlidingPhase] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const slideProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      if (SLIDES.length === 0) {
        router.replace('/(auth)/welcome');
        return;
      }

      const fadeSlidesEndIndex = Math.max(
        0,
        SLIDES.length - SLIDING_COUNT - 1
      ); // index up to which we fade

      // --- First slide: simple fade in from black ---
      setBaseIndex(0);
      setFrontIndex(0);
      setIsSlidingPhase(false);
      overlayOpacity.setValue(0);
      slideProgress.setValue(0);

      await new Promise<void>(resolve => {
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: FADE_DURATION_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start(() => resolve());
      });

      await new Promise<void>(resolve =>
        setTimeout(resolve, HOLD_DURATION_MS)
      );

      // --- Remaining slides ---
      for (let i = 1; i < SLIDES.length; i++) {
        if (!isMounted) return;

        const isSliding = i > fadeSlidesEndIndex;
        setIsSlidingPhase(isSliding);
        setFrontIndex(i);

        if (!isSliding) {
          // === FADE PHASE ===
          overlayOpacity.setValue(0);
          slideProgress.setValue(0);

          await new Promise<void>(resolve => {
            Animated.timing(overlayOpacity, {
              toValue: 1,
              duration: FADE_DURATION_MS,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start(() => resolve());
          });

          // after fade, promote front to base
          setBaseIndex(i);
          overlayOpacity.setValue(1);

          await new Promise<void>(resolve =>
            setTimeout(resolve, HOLD_DURATION_MS)
          );
        } else {
          // === SLIDE PHASE ===
          // base starts at 0, front starts off-screen to the right
          slideProgress.setValue(0);
          // keep both fully opaque during the slide
          overlayOpacity.setValue(1);

          await new Promise<void>(resolve => {
            Animated.timing(slideProgress, {
              toValue: 1,
              duration: FADE_DURATION_MS,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }).start(() => resolve());
          });

          // after sliding, the front becomes the new base
          setBaseIndex(i);
          slideProgress.setValue(0);

          await new Promise<void>(resolve =>
            setTimeout(resolve, HOLD_DURATION_MS)
          );
        }
      }

      if (isMounted) {
        await new Promise<void>(resolve =>
          setTimeout(resolve, FINAL_HOLD_MS)
        );
        router.replace('/(auth)/welcome');
      }
    };

    runSequence();

    return () => {
      isMounted = false;
      overlayOpacity.stopAnimation();
      slideProgress.stopAnimation();
    };
  }, [overlayOpacity, slideProgress]);

  // Interpolated translation for sliding phase
  const baseTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width], // current slide moves left
  });

  const frontTranslateX = slideProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [width, 0], // next slide comes from the right
  });

  return (
    <View style={styles.container}>
      {/* Base image (always there underneath) */}
      <Animated.Image
        source={SLIDES[baseIndex]}
        style={[
          styles.image,
          {
            width,
            height,
            opacity: 1,
            transform: isSlidingPhase ? [{ translateX: baseTranslateX }] : [],
          },
        ]}
        resizeMode="cover"
      />

      {/* Overlay / incoming image */}
      <Animated.Image
        source={SLIDES[frontIndex]}
        style={[
          styles.image,
          {
            width,
            height,
            position: 'absolute',
            top: 0,
            left: 0,
            // In fade phase, we use opacity; in slide phase we keep it 1 and move it
            opacity: isSlidingPhase ? 1 : overlayOpacity,
            transform: isSlidingPhase
              ? [{ translateX: frontTranslateX }]
              : [],
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // avoid white flash
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // width/height are set dynamically from useWindowDimensions
  },
});
