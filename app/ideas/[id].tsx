import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Idea } from '@/types/ideaTypes';
import { useIdeas } from '@/hooks/useIdeas';
import { useFocusEffect } from '@react-navigation/native';
import CustomNavbar from '@/components/custom/customNavBar';

const IdeasDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const router = useRouter();

  const { getIdeaById, softDeleteIdea } = useIdeas();

  useFocusEffect(
    useCallback(() => {
      const fetchIdea = async () => {
        if (id) {
          const ideaData = await getIdeaById(id);
          setIdea(ideaData);
        }
      };
      fetchIdea();
    }, [id])
  );

  const handleEdit = () => {
    if (idea) {
      router.push({
        pathname: '/ideas/addEditIdea',
        params: {
          mode: 'edit',
          id: idea.id
        }
      });
    }
  };

  const handleDelete = () => {
    if (idea) {
      Alert.alert(
        'Delete Idea',
        'Are you sure you want to delete this idea? \nYou can recover idea from delted ideas section',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Proceed',
            style: 'destructive',
            onPress: async () => {
              await softDeleteIdea(idea.id);
              Alert.alert('Success', 'Idea moved to trash!!', 
                [
                  { text: 'Ok', onPress: router.back }
                ]);
            }
          }
        ]
      );
    }
  };

  const ActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons name="pencil" size={20} color="#5B21B6" />
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash" size={20} color="#DC2626" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (!idea) {
    return (
      <View style={styles.container}>
        <CustomNavbar title="Idea Details" />
        <View style={styles.centerContent}>
          <Text>Idea not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomNavbar
        title="Idea Details"
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{idea.title}</Text>

        <Text style={styles.sectionTitle}>Purpose</Text>
        <Text style={styles.text}>{idea.purpose}</Text>

        {idea.tools && idea.tools.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tools Required</Text>
            <View style={styles.toolsContainer}>
              {idea.tools.map((tool, index) => (
                <View key={index} style={styles.toolTag}>
                  <Text style={styles.toolText}>{tool}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{idea.description}</Text>

        {idea.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{idea.category}</Text>
          </View>
        )}

        <Text style={styles.dateText}>Created: {new Date(idea.createdAt).toLocaleDateString()}</Text>

        <ActionButtons />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B21B6',
  },
  categoryContainer: {
    marginVertical: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#5B21B6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#6D28D9',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  toolTag: {
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  toolText: {
    color: '#5B21B6',
    fontSize: 14,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  editButtonText: {
    color: '#5B21B6',
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default IdeasDetail;