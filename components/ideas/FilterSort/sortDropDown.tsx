import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SortDropdownProps, SortOrder } from '@/types/FilterSortIdea';

const SortDropdown = ({ currentOption, options, onSelect }: SortDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleSelect = (option: SortOrder) => {
    onSelect(option);
    setIsDropdownOpen(false);
  };
  
  return (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={styles.sortDropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.sortDropdownText}>
          {options.find(option => option.value === currentOption)?.label || 'Sort by'}
        </Text>
        <Ionicons 
          name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#6B7280" 
        />
      </TouchableOpacity>
      
      {isDropdownOpen && (
        <View style={styles.sortDropdownMenu}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={styles.sortDropdownItem}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={[
                styles.sortDropdownItemText,
                currentOption === option.value && styles.selectedSortOption
              ]}>
                {option.label}
              </Text>
              {currentOption === option.value && (
                <Ionicons name="checkmark" size={16} color="#5B21B6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    flex: 1,
    maxWidth: '70%',
    position: 'relative',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  sortDropdownText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  sortDropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    left: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sortDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortDropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedSortOption: {
    color: '#5B21B6',
    fontWeight: '600',
  }
});

export default SortDropdown;