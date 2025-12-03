import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const Thread = () => {
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>I'm doing this shit later its too late for me to be doing all that</Text>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Thread;