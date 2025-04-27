import { Idea} from "./ideaTypes";

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'desc' },
  { label: 'Oldest First', value: 'asc' }
];

  export interface FilteredChipProps {
    fieldName: string;
    filterValue: string;
    onClear: () => void;
  }

  export interface SortOption {
    label: string;
    value: SortOrder;
  }
  
  export interface SortDropdownProps {
    currentOption: SortOrder;
    options: SortOption[];
    onSelect: (option: SortOrder) => void;
  }
  
  
export interface UseFilteredIdeasProps {
    ideas: Idea[];
    searchText: string;
    filterBy: FilterField;
    sortBy: SortOrder;
  }

export type FilterField = 'title' | 'purpose' | 'description' | 'category' | 'tools';
export type SortOrder = 'asc' | 'desc';
  