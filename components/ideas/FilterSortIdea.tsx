import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Idea } from '@/types/ideaTypes';
import SortDropdown from './FilterSort/sortDropDown';
import { FilterField, SortOrder } from '@/types/FilterSortIdea';
import FilteredChip from './FilterSort/filteredChip';
import FilterModal, { FILTER_FIELDS } from './FilterSort/filterModal';
import { filterAndSortIdeas } from '@/utils/ideas/ideaFilterSort';

interface FilterSortingProps {
  ideas: Idea[];
  onFilteredIdeasChange: (filteredIdeas: Idea[]) => void;
}

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Newest First', value: 'desc' },
  { label: 'Oldest First', value: 'asc' }
];

const FilterSortIdea = ({ ideas, onFilteredIdeasChange }: FilterSortingProps) => {
  // Filter states
  const [selectedField, setSelectedField] = useState<FilterField>('title');
  const [filterValue, setFilterValue] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  
  // Sort states
  const [sortOption, setSortOption] = useState<SortOrder>('desc');
  
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // Apply filtering and sorting
  useEffect(() => {
    if (ideas.length > 0) {
      const filteredResults = isFilterApplied 
        ? filterAndSortIdeas(ideas, filterValue, selectedField, sortOption)
        : [...ideas].sort((a, b) => {
            const aDate = new Date(a.createdAt).getTime();
            const bDate = new Date(b.createdAt).getTime();
            return sortOption === 'asc' ? aDate - bDate : bDate - aDate;
          });
      
      onFilteredIdeasChange(filteredResults);
    }
  }, [ideas, isFilterApplied, selectedField, filterValue, sortOption]);
  
  const openFilterModal = () => {
    setIsFilterModalVisible(true);
  };
  
  const closeFilterModal = () => {
    setIsFilterModalVisible(false);
  };
  
  const handleApplyFilter = (field: FilterField, value: string) => {
    setSelectedField(field);
    setFilterValue(value);
    setIsFilterApplied(true);
    closeFilterModal();
  };
  
  const handleClearFilter = () => {
    setSelectedField('title');
    setFilterValue('');
    setIsFilterApplied(false);
    closeFilterModal();
  };
  
  const handleSortSelection = (option: SortOrder) => {
    setSortOption(option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
        <SortDropdown
          currentOption={sortOption}
          options={SORT_OPTIONS}
          onSelect={handleSortSelection}
        />

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={openFilterModal}
        >
          <Ionicons name="options-outline" size={22} color="#5B21B6" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {isFilterApplied && (
        <FilteredChip
          fieldName={FILTER_FIELDS.find(f => f.value === selectedField)?.label || ''}
          filterValue={filterValue}
          onClear={handleClearFilter}
        />
      )}
      
      <FilterModal
        visible={isFilterModalVisible}
        initialField={selectedField}
        initialValue={filterValue}
        onClose={closeFilterModal}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  filterButtonText: {
    marginLeft: 4,
    color: '#5B21B6',
    fontWeight: '500',
  }
});

export default FilterSortIdea;