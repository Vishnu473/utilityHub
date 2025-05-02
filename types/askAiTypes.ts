export interface AskAI {
    id: string;
    question: string;
    answer: string;
    createdAt: string;
    deletedAt: string | null;
}

export const generateAskAIId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

export type AskAIItemProps = {
    question: string;
    answer: string;
    onPress: () => void;
}
