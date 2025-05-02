import { askGemini } from "@/services/aiService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  addAskAI, 
  updateAskAIAnswer, 
  softDeleteAskAI, 
  clearAllAskAI 
} from "@/storage/askAI/askAIService";
import { useState } from "react";
import { AskAI } from "@/types/askAiTypes";
import { getAskAIList } from "@/storage/askAI/askAISelector";

type AskAIProps = {
  question: string;
  topic: string | null;
};

export const useAskAIChat = () => {
  const queryClient = useQueryClient();
  const [lastQuestionError, setLastQuestionError] = useState<string | null>(null);

  // Use React Query to fetch and cache the Q&A list
  const { data: askAIList = [] } = useQuery({
    queryKey: ['askAIList'],
    queryFn: getAskAIList,
    staleTime: 1000 * 60 * 10, // 10 minutes
    initialData: [],
  });

  // Mutation for asking the AI
  const askMutation = useMutation({
    mutationFn: async ({ question, topic }: AskAIProps) => {
      // Format the question based on topic
      const finalQuestion = topic
        ? `Acting as a friendly and approachable expert in ${topic}, please explain the following question: "${question}" in a way that is easy for someone new to the topic to understand.`
        : `As an expert with knowledge on all topics, answer the following question: ${question} in a clean, well-detailed, and concise format.`;

      // Generate a unique ID for this question
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const createdAt = new Date().toISOString();

      // Create the new entry with empty answer initially
      const newEntry: AskAI = {
        id,
        question,
        answer: "",
        createdAt,
        deletedAt: null,
        topic: topic || "General",
        status: "loading",
      };

      // Step 1: Add the question to local storage and update UI immediately
      await addAskAI(newEntry);
      
      // Update cache to show the entry right away
      queryClient.setQueryData(['askAIList'], (oldData: AskAI[] = []) => 
        [newEntry, ...oldData].slice(0, 40)
      );

      try {
        // Step 2: Get the response from AI
        const response = await askGemini(finalQuestion);

        if (!response || response.trim() === "") {
          throw new Error("Received empty response from AI");
        }

        // Step 3: Update the answer in storage and UI
        const updatedEntry = { 
          ...newEntry, 
          answer: response,
          status: "completed" 
        };
        
        await updateAskAIAnswer(id, response);
        
        // Update the cache again with the completed answer
        queryClient.setQueryData(['askAIList'], (oldData: AskAI[] = []) => 
          oldData.map(item => item.id === id ? updatedEntry : item)
        );

        setLastQuestionError(null);
        return { id, response };
      } catch (error) {
        console.error("Error while fetching response:", error);
        
        // Update the entry to show error status
        const errorEntry = { 
          ...newEntry, 
          status: "error",
          answer: "Failed to get a response. Please try again."
        };
        
        await updateAskAIAnswer(id, "Failed to get a response. Please try again.");
        
        // Update the cache with the error state
        queryClient.setQueryData(['askAIList'], (oldData: AskAI[] = []) => 
          oldData.map(item => item.id === id ? errorEntry : item)
        );
        
        setLastQuestionError(question);
        throw error;
      }
    }
  });

  // Retry a failed question
  const retryQuestion = async (question: string, topic: string | null) => {
    setLastQuestionError(null);
    return askMutation.mutateAsync({ question, topic });
  };

  // Delete a question
  const deleteQuestion = async (id: string) => {
    await softDeleteAskAI(id);
    queryClient.setQueryData(['askAIList'], (oldData: AskAI[] = []) => 
      oldData.filter(q => q.id !== id)
    );
  };

  // Clear all questions
  const clearAll = async () => {
    await clearAllAskAI();
    queryClient.setQueryData(['askAIList'], []);
  };

  return {
    askAIList,
    ask: (question: string, topic: string | null) => 
      askMutation.mutateAsync({ question, topic }),
    retryQuestion,
    lastQuestionError,
    deleteQuestion,
    clearAll,
    isPending: askMutation.isPending,
    isError: askMutation.isError,
    error: askMutation.error,
  };
};