import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const colors = {
  primary: '#3A59D1',      
  primaryLight: '#AFDDFF',  
  secondary: '#adadad',     
  textDark: '#4B5563',      
  textLight: '#9CA3AF',     
  background: '#FFFFFF',    
  surface: '#F9FAFB', 
}

const TabIcon = ({ focused, icon, name }: any) => {
  return (
    <View 
      style={{ 
        width: focused ? 95 : 60, 
        height: 45, 
        borderRadius: 50, 
        backgroundColor: focused ? colors.primaryLight : 'transparent', 
        justifyContent: "center", 
        flexDirection: focused ? 'row' : 'column', 
        alignItems: 'center', 
        gap: 6,
        paddingHorizontal: 12
      }}
    >
      <Ionicons 
        color={focused ? colors.primary : colors.textLight} 
        name={icon} 
        size={22} 
      />
      {focused && (
        <Text 
          style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: colors.primary
          }}
        >
          {name}
        </Text>
      )}
    </View>
  );
}

const TabLayout = () => {
  return (
    <Tabs 
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 47,
          justifyContent: 'center',
          borderTopWidth: 1,
          borderTopColor: '#f1f1f1',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 5,
        },
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="vaultHome"
        options={{
          title: 'Vault',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name='Vault' icon="lock-closed" />
          )
        }} 
      />
      <Tabs.Screen
        name='ideasHome'
        options={{
          title: 'Ideas',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name='Ideas' icon="bulb" />
          )
        }} 
      />
      <Tabs.Screen
        name="askAIHome"
        options={{
          title: 'Ask AI',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name='AskAI' icon="chatbubbles" />
          )
        }} 
      />
      {/* <Tabs.Screen
        name="profileHome"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name='Profile' icon="person-circle" />
          )
        }} 
      /> */}
    </Tabs>
  )
}

export default TabLayout