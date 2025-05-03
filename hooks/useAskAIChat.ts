import { askGemini } from "@/services/aiService";
import { useState, useEffect, useCallback } from "react";
import { AskAI } from "@/types/askAiTypes";
import { 
  addAskAI, 
  updateAskAIAnswer, 
  softDeleteAskAI, 
  clearAllAskAI,
} from "@/storage/askAI/askAIService";
import { getAskAIList } from "@/storage/askAI/askAISelector";

type AskAIProps = {
  question: string;
  topic: string | null;
};

export const useAskAIChat = () => {
  // State management
  const [askAIList, setAskAIList] = useState<AskAI[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastQuestionError, setLastQuestionError] = useState<string | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const data = await getAskAIList();
      setAskAIList(data);
    } catch (err) {
      console.error("Error loading AskAI data:", err);
      setIsError(true);
      setError(err instanceof Error ? err : new Error("Failed to load data"));
    } finally {
      setInitialDataLoaded(true);
    }
  };

  // Function to refresh data
  const refreshData = useCallback(async () => {
    await loadData();
  }, []);

  // Function to ask the AI
  const ask = useCallback(async ({ question, topic }: AskAIProps) => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    // Format the question based on topic
    const finalQuestion = topic
      ? `Acting as a friendly and approachable expert in ${topic}, please explain the following question: "${question}" in a way that is easy for someone new to the topic to understand.`
      : `As an expert with knowledge on all topics, answer the following question: ${question} in a clean, well-detailed, concise format and upto the question`;

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

    try {
      // Step 1: Add the question to local storage and update UI immediately
      await addAskAI(newEntry);
      
      // Update state to show the entry right away
      setAskAIList(prevList => [ ...prevList,newEntry].slice(0, 40));

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
      
      // Update state with the completed answer
      setAskAIList(prevList => 
        prevList.map(item => item.id === id ? updatedEntry : item)
      );

      setLastQuestionError(null);
      setIsPending(false);
      return { id, response };
    } catch (error) {
      console.error("Error while fetching response:", error);
      setIsError(true);
      setError(error instanceof Error ? error : new Error("Failed to get AI response"));
      
      // Update the entry to show error status
      const errorEntry = { 
        ...newEntry, 
        status: "error",
        answer: "Failed to get a response. Please try again."
      };
      
      await updateAskAIAnswer(id, "Failed to get a response. Please try again.");
      
      // Update state with the error
      setAskAIList(prevList => 
        prevList.map(item => item.id === id ? errorEntry : item)
      );
      
      setLastQuestionError(question);
      setIsPending(false);
      throw error;
    }
  }, []);

  // Retry a failed question
  const retryQuestion = useCallback(async (question: string, topic: string | null) => {
    setLastQuestionError(null);
    return ask({ question, topic });
  }, [ask]);

  // Delete a question
  const deleteQuestion = async (id: string) => {
    try {
      setIsPending(true);
      await softDeleteAskAI(id);
      setAskAIList(prevList => prevList.filter(q => q.id !== id));
      console.log(askAIList.length);
      setIsError(false);
    } catch (error) {
      console.error("Error deleting question:", error);
      setIsError(true);
      setError(error instanceof Error ? error : new Error("Failed to delete question"));
    } finally {
      setIsPending(false);
    }
  };

  // Clear all questions
  const clearAll = useCallback(async () => {
    try {
      setIsPending(true);
      await clearAllAskAI();
      setAskAIList([]);
      setIsError(false);
    } catch (error) {
      console.error("Error clearing all questions:", error);
      setIsError(true);
      setError(error instanceof Error ? error : new Error("Failed to clear questions"));
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    askAIList,
    ask: (question: string, topic: string | null) => ask({ question, topic }),
    retryQuestion,
    lastQuestionError,
    deleteQuestion,
    clearAll,
    refreshData,
    isPending,
    isError,
    error,
    initialDataLoaded,
  };
};