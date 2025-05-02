import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  text, 
  onChangeText, 
  onSubmit 
}) => {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={onChangeText}
        placeholder="Type your message..."
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={onSubmit}
      >
        <Ionicons name='send' size={22} color={'#000'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  textInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    position: 'absolute',
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dedede',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageInput;