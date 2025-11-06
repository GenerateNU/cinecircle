/*
SCREEN THREE

## DATA
  - profile pic


unknown component, need to make for this?

*/

import { View } from 'react-native'
import { router } from 'expo-router'
import NextButton from '../../components/NextButton';
import Tag from '../../components/Tag';

export default function username() {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <Tag label="hello world!"/>
            <NextButton onPress={() => go("onboarding/countrySelect")}/>
        </View>
    );
};
