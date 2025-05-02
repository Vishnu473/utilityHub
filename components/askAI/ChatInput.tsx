import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChatInputProps = {
  text: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
};

const ChatInput = ({
  text,
  onChangeText,
  onSubmit,
  isLoading = false,
  placeholder = 'Type your question...',
}: ChatInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Animation for the send button
  useEffect(() => {
    if (text.trim()) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }
  }, [text]);

  // Focus the input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      Keyboard.dismiss();
      onSubmit();
      
      // Animation for button press
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          multiline
          maxLength={500}
          returnKeyType="default"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            // Allow Enter key to submit on web, but not on mobile
            if (Platform.OS === 'web' && text.trim() && !isLoading) {
              handleSubmit();
            }
          }}
          editable={!isLoading}
        />
        
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
            !text.trim() && styles.buttonDisabled,
          ]}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!text.trim() || isLoading}
            style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {text.length > 400 && (
        <View style={styles.characterCount}>
          <Text style={[
            styles.countText,
            text.length > 480 && styles.countWarning
          ]}>
            {text.length}/500
          </Text>
        </View>
      )}
    </View>
  );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 50,
    paddingHorizontal: 16,
    paddingRight: 50,
  },
  buttonContainer: {
    marginBottom: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#b0d0ff',
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 10,
  },
  countText: {
    fontSize: 12,
    color: '#aaa',
  },
  countWarning: {
    color: '#f0ad4e',
  },
});

export default ChatInput;