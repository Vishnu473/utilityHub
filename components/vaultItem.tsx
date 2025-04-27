import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

// Light blue color palette
const colors = {
  cardBg: '#F0F7FF',
  cardBorder: '#D0E1F9',
  titleText: '#0A4D82',
  usernameText: '#3280BA',
  categoryBg: '#E1EFFE',
  categoryText: '#2C6EB0',
  shadowColor: '#AECDF4',
}

type VaultItemProps = {
  title: string,
  username: string,
  category: string,
  onPress: () => void
}

const VaultItem = ({ title, username, category, onPress }: VaultItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.9}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={20} color={colors.titleText} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.username}>{username}</Text>

        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{category}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.addText}>Tap to detail</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.categoryText} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default VaultItem

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.titleText,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: colors.usernameText,
    marginBottom: 8,
  },
  categoryContainer: {
    backgroundColor: colors.categoryBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.categoryText,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  addText: {
    fontSize: 12,
    color: colors.categoryText,
    fontWeight: '500',
    marginRight: 2,
  }
})