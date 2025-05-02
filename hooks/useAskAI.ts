import { askGemini } from "@/services/aiService"
import { useMutation } from "@tanstack/react-query"


type AskAIProps = {
    question: string,
    topic: string | null
}

export const useAskAI = () => {
    const mutation = useMutation({
        mutationFn: async ({ question, topic }: AskAIProps) => {
            let finalQuestion = `As an expert with knowledge on all topics, answer the following ${question} in a clen and well detailed and short format.`;

            if (topic) {
                finalQuestion = `Acting as a friendly and approachable expert in ${topic}, please explain the following question: "${question}" in a way that is easy for someone new to the topic to understand.`;
            }
            return await askGemini(finalQuestion);
        }
    });

    return {
        ask: (question: string, topic: string | null) =>
            mutation.mutateAsync({ question, topic }), ...mutation,
    };
}