import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatTopicSelectorProps {
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
}

const ChatTopicSelector: React.FC<ChatTopicSelectorProps> = ({ 
  selectedTopic, 
  onSelectTopic 
}) => {
  const getStyles = (iconName: string) => {
    return selectedTopic === iconName 
      ? { ...styles.customIcon, ...styles.selectedIcon } 
      : { ...styles.customIcon };
  };

  // Updated topics with more comprehensive options from original component
  const topics = [
    { id: 'general', name: 'General', icon: 'help-circle' },
    { id: 'technology', name: 'Technology', icon: 'hardware-chip' },
    { id: 'science', name: 'Science', icon: 'flask' },
    { id: 'math', name: 'Mathematics', icon: 'calculator' },
    { id: 'health', name: 'Health', icon: 'fitness' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'art', name: 'Art & Culture', icon: 'color-palette' },
    { id: 'sports', name: 'Sports', icon: 'basketball' }
  ];

  const currentTopic = selectedTopic
    ? topics.find(t => t.id === selectedTopic) || topics[0]
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.chatTopicSelectorRow}>
        <Text style={styles.label}>Topic:</Text>
        
        {currentTopic && (
          <View style={styles.selectedTopicContainer}>
            <Text style={styles.topicButtonText}>
              {currentTopic.name}
            </Text>
            <Ionicons 
              name="close-circle" 
              size={16} 
              color="#999" 
              style={styles.clearButton}
              onPress={() => onSelectTopic(null)}
            />
          </View>
        )}
      </View>

      <View style={styles.iconContainer}>
        {topics.map((topic) => (
          <View key={topic.id} style={styles.topicIconWrapper}>
            <Ionicons
              name={selectedTopic === topic.id ? (topic.icon as any) : (`${topic.icon}-outline` as any)}
              size={20}
              style={getStyles(topic.id)}
              onPress={() => onSelectTopic(topic.id)}
            />
            {/* <Text style={selectedTopic === topic.id ? styles.selectedTopicLabel : styles.topicLabel}>
              {topic.name}
            </Text> */}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  chatTopicSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  selectedTopicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicButtonText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
    marginRight: 4,
  },
  clearButton: {
    marginLeft: 4,
  },
  iconContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topicIconWrapper: {
    alignItems: 'center',
    width: 42,
  },
  customIcon: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 25,
    marginBottom: 4,
  },
  selectedIcon: {
    backgroundColor: '#F0F7FF',
    color: '#3498ff',
    borderColor: '#2980b9'
  },
  topicLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  selectedTopicLabel: {
    fontSize: 11,
    color: '#3498ff',
    fontWeight: '500',
    textAlign: 'center',
  }
});

export default ChatTopicSelector;