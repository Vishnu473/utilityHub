import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

type ToastProps = {
  text1?: string;
  text2?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
};

export const CustomToast = ({ text1, text2, type = 'warning' }: ToastProps) => {
  // Define colors based on toast type
  const colors = {
    success: {
      background: '#E7F5E4',
      border: '#4CAF50',
      text: '#1B5E20',
    },
    error: {
      background: '#FFEBEE',
      border: '#F44336',
      text: '#B71C1C',
    },
    info: {
      background: '#E3F2FD',
      border: '#2196F3',
      text: '#0D47A1',
    },
    warning: {
      background: '#FFF8E1',
      border: '#FFC107',
      text: '#F57F17',
    },
  };

  const { background, border, text } = colors[type];

  return (
    <View style={[styles.container, { backgroundColor: background, borderLeftColor: border }]}>
      <View style={styles.contentContainer}>
        {text1 && <Text style={[styles.title, { color: text }]}>{text1}</Text>}
        {text2 && <Text style={[styles.message, { color: text }]}>{text2}</Text>}
      </View>
      
      <TouchableOpacity
        onPress={() => Toast.hide()}
        style={styles.dismissButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    opacity: 0.8,
  },
  dismissButton: {
    marginLeft: 12,
    padding: 4,
  },
  dismissText: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '300',
  },
});

