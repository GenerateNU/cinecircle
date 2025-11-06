/*
SCREEN FIVE

## DATA
  - City

Components:
  - Text input

*/

import { View } from 'react-native'
import { router } from 'expo-router'
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';

export default function username() {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <Tag label="genre"/>
            <NextButton onPress={() => go("onboarding/done!")}/>
        </View>
    );
};
