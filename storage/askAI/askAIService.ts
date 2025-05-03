import { saveData } from "../utils/mmkvStorageHelpers";
import { AskAI } from "@/types/askAiTypes";
import { getAskAIList } from "./askAISelector";

const ASK_AI_KEY = "ask_ai_history";
const MAX_ENTRIES = 40;

export const addAskAI = async (entry: AskAI) => {
  const list = await getAskAIList();

  const updatedList = [...list, entry].slice(-MAX_ENTRIES); // Keep only latest N
  await saveData(ASK_AI_KEY, updatedList);
};


export const updateAskAIAnswer = async (id: string, answer: string) => {
  const list = await getAskAIList();
  const updatedList = list.map(item =>
    item.id === id ? { ...item, answer } : item
  );
  await saveData(ASK_AI_KEY, updatedList);
};

export const softDeleteAskAI = async (id: string) => {
  const list = await getAskAIList();
  const updatedList = list.map(item =>
    item.id === id ? { ...item, deletedAt: new Date().toISOString() } : item
  );
  await saveData(ASK_AI_KEY, updatedList);
};

export const clearAllAskAI = async () => {
  await saveData(ASK_AI_KEY, []);
};
