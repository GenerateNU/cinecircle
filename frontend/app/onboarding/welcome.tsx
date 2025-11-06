import { Text, Image, View, useWindowDimensions } from 'react-native'
import logo from '../../assets/icon.png'
import NextButton from '../../components/NextButton';

export default function welcome () {
    const { width, height } = useWindowDimensions();

    return (
        <View style={{ alignItems: 'center'}}>
            <Image 
                source={logo}
                style={{
                    width: width * 0.5,
                    height: height * 0.5,
                }}
                resizeMode="contain"
                />
            <Text>HELLO HELLO HELLO HELLOW HELLOW</Text> 
            <View>
                <NextButton title="Log in" onPress={()=> console.log("hi")} size="large" variation='variation1'/>
                <NextButton title="Sign up" onPress={()=> console.log("hi")} size="large"/>
            </View>
        </View>
    )
}