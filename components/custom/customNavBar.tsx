import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type CustomNavBarProps = {
  title: string;
  bgColor?: string;
  textColor?: string;
  showBackButton?: boolean;
  rightIcon?: React.ReactNode;
};

const CustomNavbar = ({ 
  title, 
  bgColor = '#F5F3FF', 
  textColor = '#5B21B6', 
  showBackButton = true,
  rightIcon
}: CustomNavBarProps) => {
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: bgColor }]}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {rightIcon && (
        <View style={styles.rightIcon}>
          {rightIcon}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rightIcon: {
    marginLeft: 10,
  }
});

export default CustomNavbar;