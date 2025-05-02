import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopicSelectorProps {
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ 
  selectedTopic, 
  onSelectTopic 
}) => {
  const getStyles = (iconName: string) => {
    return selectedTopic === iconName 
      ? { ...styles.customIcon, ...styles.selectedIcon } 
      : { ...styles.customIcon };
  };

  const topics = [
    { name: 'fitness', icon: 'fitness' },
    { name: 'happy', icon: 'happy' },
    { name: 'alarm', icon: 'alarm' },
    { name: 'gift', icon: 'gift' }
  ];

  return (
    <View style={styles.iconContainer}>
      {topics.map((topic) => (
        <Ionicons
          key={topic.name}
          name={selectedTopic === topic.name ? (topic.icon as any) : (`${topic.icon}-outline` as any)}
          size={18}
          style={getStyles(topic.name)}
          onPress={() => onSelectTopic(topic.name)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center'
  },
  customIcon: {
    padding: 7,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 25
  },
  selectedIcon: {
    backgroundColor: '#F0F7FF',
    color: '#3498ff',
    borderColor: '#2980b9'
  }
});

export default TopicSelector;