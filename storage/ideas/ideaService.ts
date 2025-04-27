import { Idea } from "@/types/ideaTypes";
import { getData, saveData } from "../utils/mmkvStorageHelpers";
import { getActiveIdeas } from "./ideaSelectors";

export const updateIdea = async (updatedIdea: Idea) => {
  const ideas = await getActiveIdeas();

  const updatedIdeas = ideas.map((idea) =>
    idea.id === updatedIdea.id ? { ...updatedIdea, updatedAt: new Date().toISOString() } : idea
  );

  await saveData('ideasList', updatedIdeas);
};

// Function to save a new idea
export const addIdea = async (newIdea: Idea) => {
  try {
    // Get the current ideas from storage
    const existingIdeas = await getData('ideasList');
    const updatedIdeas = existingIdeas ? [...existingIdeas, newIdea] : [newIdea];

    // Save the updated list of ideas
    await saveData('ideasList', updatedIdeas);
    console.log('Idea added successfully!');
  } catch (error) {
    console.error('Failed to add idea:', error);
  }
};

export const softDeleteIdea = async (id: string) => {
  try {
      const ideas = await getData('ideasList');
      if (!ideas) return;

      const updatedIdeas = ideas.map((idea: Idea) => {
          if (idea.id === id) {
              return { ...idea, deletedAt: new Date().toISOString() };
          }
          return idea;
      });

      await saveData('ideasList', updatedIdeas);  // Save updated ideas back to storage
  } catch (error) {
      console.error('Failed to soft delete idea:', error);
  }
};

// Undelete (restore deleted idea)
export const undeleteIdea = async (id: string) => {
  try {
      const ideas = await getData('ideasList');  // Retrieve all ideas
      if (!ideas) return;

      const updatedIdeas = ideas.map((idea: Idea) => {
          if (idea.id === id && idea.deletedAt) {
              return { ...idea, deletedAt: null };  // Reset the deletedAt field to null
          }
          return idea;
      });

      await saveData('ideasList', updatedIdeas);  // Save updated ideas back to storage
  } catch (error) {
      console.error('Failed to undelete idea:', error);
  }
};

// Permanently Delete
export const permanentlyDeleteIdea = async (id: string) => {
  try {
      const ideas = await getData('ideasList');  // Retrieve all ideas
      if (!ideas) return;

      const updatedIdeas = ideas.filter((idea: Idea) => idea.id !== id);  // Remove the idea
      await saveData('ideasList', updatedIdeas);  // Save updated ideas back to storage
  } catch (error) {
      console.error('Failed to permanently delete idea:', error);
  }
};
