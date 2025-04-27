import { Idea } from "@/types/ideaTypes";
import { getData } from "../utils/mmkvStorageHelpers";

export const getAllIdeas = async (): Promise<Idea[]> => {
  const ideas = await getData('ideasList');
  return ideas ?? [];
};
  
  export const getActiveIdeas = async(): Promise<Idea[]> => {
    const ideas = await getAllIdeas();
    return (ideas ?? []).filter((idea: Idea) => idea.deletedAt === null);
  }

  export const getIdeaById = async (id: string): Promise<Idea | null> => {
    const ideas = await getActiveIdeas();
    return ideas.find((idea) => idea.id === id) ?? null;
  };
  
  export const getDeletedIdeas = async (): Promise<Idea[]> => {
    const ideas = await getAllIdeas();
    return ideas.filter((idea) => idea.deletedAt !== null);
  };