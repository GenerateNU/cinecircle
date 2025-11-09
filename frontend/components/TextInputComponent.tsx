import { View, TextInput, Text, TextInputProps as RNTextInputProps } from 'react-native';
import { styles } from '../styles/TextInputComponent.styles';

type TextInputProps = {
    title?: string;
    field?: string;
    placeholder?: string;
    subtext?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: RNTextInputProps['keyboardType'];
}

export default function TextInputComponent({ 
    title, 
    field, 
    placeholder, 
    subtext,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
} : TextInputProps) {
    return (
    <View>
        {title && <Text style={styles.title}>{title}</Text>}
        {field && <Text style={styles.field}>{field}</Text>}
        <TextInput 
            style={styles.input} 
            placeholder={placeholder} 
            placeholderTextColor="#888888"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
        />
        {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
    )
}