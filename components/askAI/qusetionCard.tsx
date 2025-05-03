import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { AskAI } from '@/types/askAiTypes';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import ThinkingDots from '../custom/thinkingDots';

type QuestionCardProps = {
  askAI: AskAI;
  onCopy: () => void;
  onDelete: () => void;
  onRetry: () => void;
};

const QuestionCard = ({
  askAI,
  onCopy,
  onDelete,
  onRetry,
}: QuestionCardProps) => {
  const { question, answer, topic, status, createdAt } = askAI;
  console.log(askAI);

  // Format the date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <View style={[
      styles.card,
      isError && styles.errorCard
    ]}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {question}
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 10 }}>
          <Text style={styles.topicText}>{topic}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.answerContainer}>
        {answer ? (
          <Markdown style={markdownStyles}>
            {answer}
          </Markdown>
        ) : isLoading ? (
          <ThinkingDots />
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{answer || 'Failed to get response'}</Text>
            {onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.errorText}>No content available</Text>
        )}

        {answer && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={onCopy}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="copy-outline" size={16} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              style={styles.actionButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  expandedCard: {
    borderColor: '#e0e0e0',
  },
  errorCard: {
    borderColor: '#ffeeee',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
  questionContainer: {
    flex: 1,
    marginLeft: 40,
    backgroundColor: '#d8d8d8',
    borderRadius: 10,
    padding: 5,
    marginTop:10,
    marginBottom:10
  },
  topicText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 21,
    paddingHorizontal: 8
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  iconContainer: {
    marginLeft: 12,
    marginTop: 4,
  },
  answerContainer: {
    padding: 16,
    paddingBottom: 8,
    paddingTop: 0,
    borderTopWidth: 1,
    marginRight: 40,
    borderRadius: 10,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#e9e9e9'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  errorContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#d9534f',
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d9534f',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#cdcdcd',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteText: {
    color: '#d9534f',
    marginLeft: 4,
    fontSize: 13,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#222',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#333',
  },
  paragraph: {
    marginVertical: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  list: {
    marginVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 8,
  },
  listItemBullet: {
    fontSize: 16,
    lineHeight: 22,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 4,
  },
  codeBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 6,
    marginVertical: 8,
  },
});

// Optimize memo comparison
const areEqual = (prevProps: QuestionCardProps, nextProps: QuestionCardProps) => {
  return (
    prevProps.askAI.id === nextProps.askAI.id &&
    prevProps.askAI.answer === nextProps.askAI.answer &&
    prevProps.askAI.status === nextProps.askAI.status
  );
};

export default React.memo(QuestionCard, areEqual);