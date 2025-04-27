import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilteredChipProps } from '@/types/FilterSortIdea';

const FilteredChip = ({ fieldName, filterValue, onClear }: FilteredChipProps) => {
  return (
    <View style={styles.filterBadge}>
      <Text style={styles.filterBadgeText}>
        {fieldName} = "{filterValue}"
      </Text>
      <TouchableOpacity onPress={onClear}>
        <Ionicons name="close-circle-sharp" size={16} color="#F5F3FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  filterBadgeText: {
    fontSize: 12,
    color: '#F5F3FF',
    marginRight: 4,
  }
});

export default FilteredChip;