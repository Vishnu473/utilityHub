export interface AskAI {
    id: string;
    question: string;
    answer: string;
    createdAt: string;
    topic:string | null;
    status? : string | null;
    deletedAt: string | null;
}

export interface QnACardProps {
  askAI: AskAI;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSummarize?: (id: string) => void;
}


export const generateAskAIId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

export type AskAIItemProps = {
    question: string;
    answer: string;
    onPress: () => void;
}
