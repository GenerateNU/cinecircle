/*
SCREEN FOUR

### DATA
  - Country of origin
    - Could be more than one

Spam a bunch of tag components with various countries
  -Do we want to hardcode select nations?

*/

import { View } from 'react-native'
import { router } from 'expo-router'
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';

export default function username() {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <TextInputComponent
                title="Set your username"
                field="Username"
            />
            <NextButton onPress={() => go("onboarding/citySelect")}/>
        </View>
    );
};
