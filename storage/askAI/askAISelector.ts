import { AskAI } from "@/types/askAiTypes";
import { getData } from "../utils/mmkvStorageHelpers";

export const getAskAIList = async (): Promise<AskAI[]> => {
  const list = await getData('ask_ai_history');
  if (!list || !Array.isArray(list)) return [];

  // Filter out deleted entries
  const filtered = list.filter((item: AskAI) => item.deletedAt === null);
  return filtered;
};

export const getAskAIById = async (id: string): Promise<AskAI | null> => {
  const list = await getAskAIList();
  return list.find(item => item.id === id) ?? null;
};
