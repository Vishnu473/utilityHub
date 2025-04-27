import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

const CheckBox = ({ checked, onPress, size }:{checked:boolean, onPress:() => void, size:number}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.checkbox, 
        { width: size, height: size },
        checked ? styles.checked : styles.unchecked
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {checked && (
        <Ionicons name="checkmark" size={size - 4} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#5B21B6',
    borderWidth: 0,
  },
  unchecked: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
});

export default CheckBox;