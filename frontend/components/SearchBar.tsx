import { View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

type SearchBarProps = {
    placeholder?: string;
    onChangeText?: (text: string) => void;
    onSubmitEditing?: (text: string) => void;
    value?: string;
};

export default function SearchBar({ 
    placeholder = "Search", 
    onChangeText,
    onSubmitEditing,
    value 
}: SearchBarProps) {
    return (
        <View style={tw`px-4 py-4 bg-white`}>
            <View style={tw`flex-row items-center bg-white border-2 border-[#8B7FD6] rounded-lg px-3 h-12`}>
                <Feather name="search" size={20} color="#999" style={tw`mr-2`} />
                <TextInput
                    style={tw`flex-1 text-base text-black`}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    onChangeText={onChangeText}
                    value={value}
                    returnKeyType="search"
                    onSubmitEditing={(e) =>
                        onSubmitEditing?.(e?.nativeEvent?.text ?? value ?? '')
                    }
                />
                <Feather
                    name="arrow-right-circle"
                    size={22}
                    color="#999"
                    style={tw`ml-2`}
                    onPress={() => onSubmitEditing?.(value ?? '')}
                />
            </View>
        </View>
    );
}
