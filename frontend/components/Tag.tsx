import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/Tag.styles'

type TagProps = {
    label: string;
    onPress?: () => void;
    pressed?: boolean;
}

export default function Tag( { label, onPress, pressed = false } : TagProps) {
    const TagContainer = onPress ? TouchableOpacity : View;
    return (
    <TagContainer 
        style={[styles.container, pressed && styles.pressed]}
        {...(onPress && { onPress })}
    >
        <Text style={[styles.text, pressed && styles.pressedText]}>
            {label}
        </Text>
    </TagContainer>
    );
}