import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type HeaderProps = {
  title: string
  rightAction?: () => void
  titleColor:string,
  headerBgColor?: string,
  showAdd?: boolean
}

const Header = ({ title, rightAction,titleColor,headerBgColor, showAdd = false }: HeaderProps) => {
  return (
    <View style={[styles.headerContainer,{backgroundColor:headerBgColor}]}>
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle,{color:titleColor}]}>{title}</Text>
        {showAdd && (
          <TouchableOpacity style={styles.addButton} onPress={rightAction}>
            <Ionicons name="add-circle" size={24} color={titleColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D0E1F9',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 16,
  },
})

export default Header