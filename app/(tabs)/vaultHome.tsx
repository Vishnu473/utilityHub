import React, { useState } from 'react'
import { FlatList, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import VaultItem from '@/components/vaultItem'
import vaultDataJson from '@/data/vault.json'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Header from '@/components/custom/header'

type Vault = {
  id: string;
  title: string;
  username?: string;
  email?:string;
  mobile?:string;
  password: string;
  category: string;
  website: string;
  notes: string;
};

const VaultHome = () => {
  const router = useRouter()
  const vaultData: Vault[] = vaultDataJson; 
  const [loading, setLoading] = useState(false)

  const handleItemPress = (id: string) => {
    // router.push(`/vault/${id}`)
  }

  const handleAddNew = () => {
    // router.push('/vault/addNewVault')
  }

  return (
    <View style={styles.container}>
      <Header title="My Vault" showAdd headerBgColor='#F0F7FF' rightAction={handleAddNew} titleColor='#3A59D1' />
      
      {!Array.isArray(vaultData) || vaultData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed" size={60} color="#64A0D0" />
          <Text style={styles.emptyText}>No items in your vault yet</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
            <Text style={styles.emptyButtonText}>Add Your First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{vaultData.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {vaultData.filter(item => item.category === "Finance").length}
              </Text>
              <Text style={styles.statLabel}>Finance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {vaultData.filter(item => item.category === "Personal").length}
              </Text>
              <Text style={styles.statLabel}>Personal</Text>
            </View>
          </View> */}

          {loading ? (
            <ActivityIndicator color="#0A4D82" style={styles.loader} />
          ) : (
            <View style={[{justifyContent:'center', flex:1 ,alignItems:'center'}]}>
            <Text style={[styles.statLabel, {fontWeight: 'thin'}]}>Work in Progress </Text>
            {/* <FlatList
              data={vaultData}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <VaultItem
                  title={item.title}
                  username={item.username || ''}
                  category={item.category}
                  onPress={
                    () => {}
                    // () => handleItemPress(item.id)
                  }
                />
              )}
            /> */}
            </View>
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A4D82',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#3280BA',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#D0E1F9',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor:'#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#3280BA',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#0A4D82',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loader: {
    marginTop: 40,
  },
})

export default VaultHome