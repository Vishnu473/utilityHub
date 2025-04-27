import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'
import { useIdeas } from '@/hooks/useIdeas'
import { useDeletedIdeas } from '@/hooks/useDeletedIdeas'
import DeletedIdeas from '../../components/ideas/deletedIdeas'
import ActiveIdeas from '@/components/ideas/activeIdeas'
import Header from '@/components/custom/header'
import { Idea } from '@/types/ideaTypes'

const colors = {
  cardBg: '#F5F3FF',
  cardBorder: '#DDD6FE',
  titleText: '#5B21B6',
  purposeText: '#7C3AED',
  highlight: '#8B5CF6',
  shadowColor: '#C4B5FD',
}

const IdeasHome = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const { ideas, loading, refreshIdeas } = useIdeas();
  const { deletedIdeas, refreshDeletedIdeas } = useDeletedIdeas();
  const [filteredActiveIdeas, setFilteredActiveIdeas] = useState<Idea[]>([]);

  useFocusEffect(
    useCallback(() => {
      refreshIdeas();
      refreshDeletedIdeas();
    }, [])
  );

  const handleAddNew = () => {
    router.push('/ideas/addEditIdea');
  }

  return (
    <View style={styles.container}>
      <Header title="My Ideas" showAdd headerBgColor='transparent' rightAction={handleAddNew} titleColor='#5B21B6' />

      <View style={[styles.tabContainer]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
          
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'deleted' && styles.activeTab]}
          onPress={() => setActiveTab('deleted')}
        >
          <Text style={[styles.tabText, activeTab === 'deleted' && styles.activeTabText]}>Deleted</Text>
          {deletedIdeas && Array.isArray(deletedIdeas) && deletedIdeas.length > 0 && (
            <View style={[styles.badge, activeTab === 'active' && styles.inActiveBadge]}>
              <Text style={styles.badgeText}>{deletedIdeas.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeTab === 'active' ? (
        <ActiveIdeas
          ideas={ideas}
          loading={loading}
          deletedIdeas={deletedIdeas}
          refreshIdeas={refreshIdeas}
          handleAddNew={handleAddNew}
          onFilterChange={(filtered) => setFilteredActiveIdeas(filtered)}
        />
      ) : (
        <DeletedIdeas
          onItemsDeleted={() => refreshDeletedIdeas()}
          onItemsRecovered={() => refreshIdeas()}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    paddingTop: 8,
    justifyContent:'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc"
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    flex:1,
    justifyContent:'center',
    borderBottomColor: '#F5F3FF',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.highlight,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: colors.titleText,
    fontWeight: '600',
  },
  inActiveTabText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.highlight,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inActiveBadge: {
    backgroundColor: '#888',
  }
})

export default IdeasHome