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
import { FilterField } from '@/types/FilterSortIdea';

interface FilterModalProps {
  visible: boolean;
  initialField: FilterField;
  initialValue: string;
  onClose: () => void;
  onApply: (field: FilterField, value: string) => void;
  onClear: () => void;
}

export const FILTER_FIELDS:{label:string, value:string}[] = [
    { label: 'Title', value: 'title' },
    { label: 'Purpose', value: 'purpose' },
    { label: 'Description', value: 'description' },
    { label: 'Category', value: 'category' },
    { label: 'Tools', value: 'tools' }
  ];
  
const FilterModal = ({ 
  visible, 
  initialField, 
  initialValue, 
  onClose, 
  onApply, 
  onClear 
}: FilterModalProps) => {
  const [tempField, setTempField] = useState<FilterField>(initialField);
  const [tempValue, setTempValue] = useState(initialValue);
  const [slideAnim] = useState(new Animated.Value(-Dimensions.get('window').width));
  
  useEffect(() => {
    if (visible) {
      setTempField(initialField);
      setTempValue(initialValue);
      
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [visible, initialField, initialValue]);
  
  const handleApply = () => {
    if (tempField && tempValue.trim()) {
      onApply(tempField, tempValue);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Dark overlay */}
        <Pressable style={styles.modalOverlay} onPress={onClose} />
        
        {/* Modal content */}
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Ideas</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <Text style={styles.fieldLabel}>Select Field</Text>
            <View style={styles.fieldOptions}>
              {FILTER_FIELDS.map(field => (
                <TouchableOpacity
                  key={field.value}
                  style={[
                    styles.fieldOption,
                    tempField === field.value && styles.selectedFieldOption
                  ]}
                  onPress={() => setTempField(field.value as FilterField)}
                >
                  <Text style={[
                    styles.fieldOptionText,
                    tempField === field.value && styles.selectedFieldOptionText
                  ]}>
                    {field.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.fieldLabel}>Filter Value</Text>
            <TextInput
              style={styles.filterInput}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`Enter value to filter by ${
                FILTER_FIELDS.find(f => f.value === tempField)?.label || 'selected field'
              }...`}
              placeholderTextColor="#9CA3AF"
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={onClear}
              >
                <Text style={styles.clearButtonText}>Clear Filter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.applyButton,
                  (!tempField || !tempValue.trim()) && styles.disabledButton
                ]} 
                onPress={handleApply}
                disabled={!tempField || !tempValue.trim()}
              >
                <Text style={styles.applyButtonText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    padding: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  fieldOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  fieldOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedFieldOption: {
    backgroundColor: '#EDE9FE',
    borderColor: '#A78BFA',
  },
  fieldOptionText: {
    color: '#4B5563',
  },
  selectedFieldOptionText: {
    color: '#5B21B6',
    fontWeight: '500',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 24,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#5B21B6',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default FilterModal;