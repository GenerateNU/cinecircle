import { Text, Image, View, useWindowDimensions } from 'react-native'
import { router } from 'expo-router'
import logo from '../../assets/icon.png'
import NextButton from '../../components/NextButton';

import { styles } from '../../styles/Welcome.styles'

export default function welcome () {
    const { width, height } = useWindowDimensions();
    const go = (to: string) => router.replace(to);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image 
                    source={logo}
                    style={{
                        width: width * 0.5,
                        height: width * 0.5,
                        marginBottom: height * 0.02,
                    }}
                    resizeMode="contain"
                />
                <Text style={[styles.title, { fontSize: width * 0.08 }]}>CineCircle</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <NextButton 
                    title="Log in" 
                    onPress={() => go("/login")} 
                    size="large" 
                    variation='variation1'
                />
                <NextButton 
                    title="Sign up" 
                    onPress={() => go("/sign-up")} 
                    size="large"
                />
            </View>
        </View>
    )
}