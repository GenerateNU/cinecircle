import { View } from 'react-native'
import { router } from 'expo-router'
import TextInputComponent from '../../components/TextInputComponent';
import NextButton from '../../components/NextButton';

export default function username() {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <TextInputComponent
                title="What city?"
                placeholder="Start typing where you're from!"
            />
            <NextButton onPress={() => go("onboarding/languageSelect")}/>
        </View>
    );
};
