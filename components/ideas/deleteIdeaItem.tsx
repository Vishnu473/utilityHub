import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Idea } from '@/types/ideaTypes';
import CheckBox from '../common/checkBox';

const DeletedIdeaItem = ({ idea, isSelected, onToggleSelect }:{idea:Idea, isSelected:boolean, onToggleSelect:() => void}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onToggleSelect}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <CheckBox checked={isSelected} onPress={onToggleSelect} size={20}/>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={[styles.title, isSelected && styles.selectedText]} numberOfLines={1}>
          {idea.title}
        </Text>
        <Text style={[styles.description, isSelected && {color:"#7C3AED"}]} numberOfLines={2}>
          {idea.description || "No description"}
        </Text>
        <Text style={[styles.deletedDate, isSelected && {color:'#7C3AED'}]}>
          Deleted: {new Date(idea.deletedAt || '').toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedContainer: {
    backgroundColor:'#FFF',
    borderColor: '#DDD6FE',
  },
  checkboxContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedText:{
    color:'#5B21B6'
  },
  description: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  deletedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default DeletedIdeaItem;