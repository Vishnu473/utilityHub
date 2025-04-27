export interface Idea{
    id: string;
    title: string;
    purpose: string;
    description: string;
    category?: string;
    tools?: string[];
    createdAt: string;
    deletedAt: string | null;
};

export const generateIdeaId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

export type IdeaItemProps = {
    title: string,
    purpose: string,
    onPress: () => void
}


