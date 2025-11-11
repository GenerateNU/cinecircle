/*
SCREEN SIX

## DATA
  - Languages, can be multiple

## Components
  - Spam a bunch of tags
  - This is more likely to be hardcoded?

*/

import { View } from 'react-native'
import { router } from 'expo-router'
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';

export default function username() {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <Tag label="language"/>
            <NextButton onPress={() => go("onboarding/countrySelect")}/>
        </View>
    );
};
