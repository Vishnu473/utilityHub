import { useMemo } from 'react';
import { Idea} from '../types/ideaTypes';
import { filterAndSortIdeas } from '@/utils/ideas/ideaFilterSort';
import { FilterField, SortOrder } from '@/types/FilterSortIdea';

interface UseFilteredIdeasProps {
  ideas: Idea[];
  searchText: string;
  filterBy: FilterField;
  sortBy: SortOrder;
}

export const useFilteredIdeas = ({
  ideas,
  searchText,
  filterBy,
  sortBy,
}: UseFilteredIdeasProps) => {
  const filteredIdeas = useMemo(() => {
    return filterAndSortIdeas(ideas, searchText, filterBy, sortBy);
  }, [ideas, searchText, filterBy, sortBy]);

  return filteredIdeas;
};
