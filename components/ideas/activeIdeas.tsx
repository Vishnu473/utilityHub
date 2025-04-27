import React, { useEffect, useState } from 'react'
import { FlatList, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import IdeaItem from '@/components/ideas/ideaItem'
import { Idea } from '@/types/ideaTypes'
import FilterSortIdea from '@/components/ideas/FilterSortIdea'

const colors = {
  cardBg: '#F5F3FF',
  cardBorder: '#DDD6FE',
  titleText: '#5B21B6',
  purposeText: '#7C3AED',
  highlight: '#8B5CF6',
  shadowColor: '#C4B5FD',
}

interface ActiveIdeasProps {
  ideas: Idea[];
  loading: boolean;
  deletedIdeas: Idea[];
  refreshIdeas: () => Promise<void>;
  handleAddNew: () => void;
  onFilterChange?: (filteredIdeas: Idea[]) => void; 
}

const ActiveIdeas: React.FC<ActiveIdeasProps> = ({ ideas, loading, deletedIdeas, refreshIdeas, handleAddNew, onFilterChange }) => {
  const router = useRouter();
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleFilteredIdeasChange = (newFilteredIdeas: Idea[]) => {
    setFilteredIdeas(newFilteredIdeas);
    if (onFilterChange) {
      onFilterChange(newFilteredIdeas);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshIdeas();
    setRefreshing(false);
  };

  useEffect(() => {
    setFilteredIdeas(ideas);
  }, [ideas]);

  const handleItemPress = (id: string) => {
    router.push({ pathname: '/ideas/[id]', params: { id } })
  }

  return (
    <View style={styles.contentContainer}>      
      {!Array.isArray(ideas) || ideas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bulb" size={60} color={colors.highlight} />
          <Text style={styles.emptyText}>You haven't added any idea yet.</Text>
          <View style={styles.emptyBtnsContainer}>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
              <Text style={styles.emptyButtonText}>Add new idea</Text>
              <Ionicons name="create-outline" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : loading ? (
        <ActivityIndicator color="#5B21B6" style={styles.loader} />
      ) : filteredIdeas.length === 0 && ideas.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No ideas match your filters</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => setFilteredIdeas(ideas)}>
            <Text style={styles.emptyButtonText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <FilterSortIdea
            ideas={ideas}
            onFilteredIdeasChange={handleFilteredIdeasChange}
          />
          <FlatList
            data={filteredIdeas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <IdeaItem
                title={item.title}
                purpose={item.purpose}
                onPress={() => handleItemPress(item.id)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.titleText,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.purposeText,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  emptyBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
})

export default ActiveIdeas