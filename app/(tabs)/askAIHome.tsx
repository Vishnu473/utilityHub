import { View, Text, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { useAskAI } from '@/hooks/useAskAI';
import { Keyboard } from 'react-native';
import MessageInput from '@/components/askAI/messageInput';
import TopicSelector from '@/components/askAI/topicSelector';
import TypewriterText from '@/components/askAI/typeWriterText';
import Markdown from 'react-native-markdown-display';

const AskAI = () => {
  const [text, setText] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const { ask, data: response, isPending, error } = useAskAI();
  const handleSetTopic = (topic: string) => {
    selectedTopic === topic ? setSelectedTopic(null) : setSelectedTopic(topic);
  };

  const handleSubmit = async () => {
    if (text.trim()) {
      Keyboard.dismiss();
      await ask(text, selectedTopic);
      setText('');

      // Scroll to bottom after response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.inner}>
            <ScrollView
              style={{flexGrow:1, paddingHorizontal:15}}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            >
              {isPending ? (
                <Text style={styles.chatText}>Thinking...</Text>
              ) : (
                <TypewriterText 
                  text={response || ''} 
                  typingSpeed={30}
                  markdownStyles={markdownStyles}
                />
              )}
            </ScrollView>

          <View style={styles.inputContainer}>
            <MessageInput
              text={text}
              onChangeText={setText}
              onSubmit={handleSubmit}
            />
            <TopicSelector
              selectedTopic={selectedTopic}
              onSelectTopic={handleSetTopic}
            />
          </View>
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatText: {
    fontWeight: '500',
    color: '#909090',
    fontSize: 15,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  }
});

const markdownStyles = StyleSheet.create({
  chatText: {
    fontSize: 18,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  scroll: {},
});

export default AskAI;