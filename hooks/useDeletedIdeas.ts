// hooks/useDeletedIdeas.ts
import { useEffect, useState } from 'react';
import { Idea } from '../types/ideaTypes';
import { getDeletedIdeas } from '../storage/ideas/ideaSelectors';
import {
  undeleteIdea as undelete,
  permanentlyDeleteIdea as permDelete,
} from '../storage/ideas/ideaService';

export const useDeletedIdeas = () => {
  const [deletedIdeas, setDeletedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const ideas = await getDeletedIdeas();
      setDeletedIdeas(ideas);
      console.log((ideas));
      
    } catch (err) {
      setError('Failed to load deleted ideas.');
      console.error('Error fetching deleted ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedIdeas();
  }, []);

  const undeleteIdea = async (id: string) => {
    try {
      await undelete(id); 
      await fetchDeletedIdeas();
    } catch (err) {
      setError('Failed to restore idea.');
      console.error('Error restoring idea:', err);
    }
  };

  const permanentlyDeleteIdea = async (id: string) => {
    try {
      await permDelete(id);
      await fetchDeletedIdeas();
    } catch (err) {
      setError('Failed to permanently delete idea.');
      console.error('Error deleting idea permanently:', err);
    }
  };

  return {
    deletedIdeas,
    loading,
    error,
    refreshDeletedIdeas: fetchDeletedIdeas,
    undeleteIdea,
    permanentlyDeleteIdea,
  };
};
