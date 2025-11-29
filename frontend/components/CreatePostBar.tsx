import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface CreatePostBarProps {
  title?: string;
  onBack?: () => void;
  onSubmit?: () => void;
}

export default function CreatePostBar({ title, onBack, onSubmit }: CreatePostBarProps) {
  return (
    <View style={styles.container}>
      
      <View style={styles.leftSide}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity onPress={onSubmit} style={styles.postButton}>
        <Text style={styles.postButtonText}>Post →</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },

  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,                 
  },

  backButton: {
    padding: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,            
    textAlign: 'left',
  },

  postButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E05B4E',
    backgroundColor: "#F7D5CD",
  },

  postButtonText: {
    color: '#E05B4E',
    fontWeight: '600',
  },
});
