import { View, TextInput, Text } from 'react-native';
import { styles } from '../styles/TextInputComponent.styles';

type TextInputProps = {
    title?: string;
    placeholder: string;
    subtext?: string;
}

export default function TextInputComponent({ title, placeholder, subtext} : TextInputProps) {
    return (
    <View>
        {title && <Text style={styles.title}>{title}</Text>}
        <TextInput style={styles.input} placeholder={placeholder}></TextInput>
        {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
    )
}