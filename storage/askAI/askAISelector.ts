import { AskAI } from "@/types/askAiTypes";
import { getData } from "../utils/mmkvStorageHelpers";

const ASK_AI_KEY = "ask_ai_history";

export const getAskAIList = async (): Promise<AskAI[]> => {
  const list = await getData(ASK_AI_KEY);
  return (list || []).reverse();
};

export const getAskAIById = async (id: string): Promise<AskAI | null> => {
  const list = await getAskAIList();
  return list.find(item => item.id === id) || null;
};
