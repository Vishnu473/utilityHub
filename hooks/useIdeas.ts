import { useEffect, useState } from 'react';
import { Idea } from '../types/ideaTypes';
import { getActiveIdeas, getAllIdeas, getIdeaById } from '../storage/ideas/ideaSelectors';
import {
  addIdea,
  updateIdea,
  softDeleteIdea,
} from '../storage/ideas/ideaService';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ideas with error handling
  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error before fetching
      const allIdeas = await getActiveIdeas();
      setIdeas(allIdeas);
      
    console.log("Ideas => ",allIdeas);
    } catch (err) {
      setError('Failed to fetch ideas. Please try again later.');
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleGetIdeaById = async(id:string) : Promise<Idea | null> => {
    try {
      return await getIdeaById(id);
    } catch (error) {
      setError('Failed tp get selected idea. Please try again later.');
      console.error('Error fetching idea by id :',error);
      return null;
    }
  }

  const handleAdd = async (newIdea: Idea) => {
    try {
      await addIdea(newIdea);
      await fetchIdeas();
    } catch (err) {
      setError('Failed to add idea. Please try again later.');
      console.error('Error adding idea:', err);
    }
  };

  const handleUpdate = async (updatedIdea: Idea) => {
    try {
      await updateIdea(updatedIdea);
      await fetchIdeas();
    } catch (err) {
      setError('Failed to update idea. Please try again later.');
      console.error('Error updating idea:', err);
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      await softDeleteIdea(id);
      await fetchIdeas();
    } catch (err) {
      setError('Failed to soft delete idea. Please try again later.');
      console.error('Error soft deleting idea:', err);
    }
  };

  return {
    ideas,
    loading,
    error, 
    refreshIdeas: fetchIdeas,
    addIdea: handleAdd,
    updateIdea: handleUpdate,
    softDeleteIdea: handleSoftDelete,
    getIdeaById: handleGetIdeaById
  };
};
