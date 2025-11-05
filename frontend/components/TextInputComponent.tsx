import { View, TextInput, Text } from 'react-native';
import { styles } from '../styles/TextInputComponent.styles';

type TextInputProps = {
    title?: string;
    field?: string;
    placeholder?: string;
    subtext?: string;
}

export default function TextInputComponent({ title, field, placeholder, subtext} : TextInputProps) {
    return (
    <View>
        {title && <Text style={styles.title}>{title}</Text>}
        {field && <Text style={styles.field}>{field}</Text>}
        <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            placeholderTextColor="#888888">
        </TextInput>
        {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
    )
}