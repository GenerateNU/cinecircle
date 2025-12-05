import { TouchableOpacity } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dimensions } from "react-native";

const { width } = Dimensions.get('window')

type BackButtonProps = {
  onPress: () => void;
};

const BackButton = ({ onPress }: BackButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name="arrow-back-ios" size={width * 0.06} color="black" />
        </TouchableOpacity>
    )
}

export default BackButton