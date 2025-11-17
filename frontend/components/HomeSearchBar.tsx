import { View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tw from 'twrnc';

type SearchBarProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: (text: string) => void;
  value?: string;
};

/**
 * Search bar variant for the home hero with transparent background
 * and a branded outline.
 */
export default function HomeSearchBar({
  placeholder = 'Search',
  onChangeText,
  onSubmitEditing,
  value,
}: SearchBarProps) {
  return (
    <View style={tw`px-0 py-0`}>
      <View
        style={[
          tw`flex-row items-center rounded-lg px-3 h-12`,
          { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#D62E05' },
        ]}
      >
        <Feather name='search' size={20} color='#FFFFFF' style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1 text-base text-white`}
          placeholder={placeholder}
          placeholderTextColor='rgba(255,255,255,0.75)'
          onChangeText={onChangeText}
          value={value}
          returnKeyType='search'
          onSubmitEditing={(e) =>
            onSubmitEditing?.(e?.nativeEvent?.text ?? value ?? '')
          }
        />
        <Feather
          name='arrow-right-circle'
          size={22}
          color='#FFFFFF'
          style={tw`ml-2`}
          onPress={() => onSubmitEditing?.(value ?? '')}
        />
      </View>
    </View>
  );
}
