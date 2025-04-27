import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { IdeaItemProps } from '@/types/ideaTypes'

const colors = {
  cardBg: '#F5F3FF',
  cardBorder: '#DDD6FE',
  titleText: '#5B21B6',
  purposeText: '#7C3AED',
  highlight: '#8B5CF6',
  shadowColor: '#C4B5FD',
}

const IdeaItem = ({ title, purpose, onPress }: IdeaItemProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.card}
      activeOpacity={0.85}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.iconContainer}>
            <Ionicons name="bulb" size={18} color={colors.highlight} />
          </View>
        </View>
        
        <Text style={styles.purpose}>{purpose}</Text>
        
        <View style={styles.footer}>
          <Text style={styles.addText}>Tap to detail</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.highlight} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default IdeaItem

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor:colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.titleText,
    flex: 1,
    marginRight: 8,
  },
  purpose: {
    fontSize: 14,
    color: colors.purposeText,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addText: {
    fontSize: 12,
    color: colors.highlight,
    fontWeight: '500',
    marginRight: 2,
  }
})