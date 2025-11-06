/*
SCREEN ONE

### DATA
- auth user
  email password
- how will this actually look with supabase?

  ##If users have to exit the app to authenticate on email
  how do we pause users from continuing the onboarding
  until it's complete?##


gmail (text input component)

password (text input component)
*/

import NextButton from "../../components/NextButton"
import TextInputComponent from "../../components/TextInputComponent"
import { router } from "expo-router"
import { View } from "react-native"

export default function signUp () {
    const go = (to: string) => router.push(to);
    return (
        <View>
            <TextInputComponent 
                title="Create Your Account"
                field="Email"
                placeholder="example@gmail.com"
            />
            <TextInputComponent
                field="Password"
                placeholder="example@gmail.com"
            />
            <NextButton onPress={() => go("onboarding/profileSelect")} size="large"/>
        </View>
    )
}