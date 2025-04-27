import { FilterField, SortOrder } from '@/types/FilterSortIdea';
import { Idea} from '../../types/ideaTypes';

export const filterAndSortIdeas = (
    ideas: Idea[],
    searchText: string,
    filterBy: FilterField,
    sortByDate: SortOrder
): Idea[] => {
    const filtered = ideas.filter((idea) => {
        const value = idea[filterBy];

        if (filterBy === 'tools' && Array.isArray(value)) {
            return value.some((tool) =>
                tool.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return typeof value === 'string' &&
            value.toLowerCase().includes(searchText.toLowerCase());
    });

    const sorted = filtered.sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();

        return sortByDate === 'asc' ? aDate - bDate : bDate - aDate;
    });

    return sorted;
};
