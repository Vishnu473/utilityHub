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
import TypewriterText from '@/components/askAI/typeWriterText';
import Markdown from 'react-native-markdown-display';

type QuestionCardProps = {
  askAI: AskAI;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRetry: () => void;
};

const QuestionCard = ({
  askAI,
  isExpanded,
  onToggle,
  onDelete,
  onRetry,
}: QuestionCardProps) => {
  const { question, answer, topic, status, createdAt } = askAI;
  
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
      isExpanded && styles.expandedCard,
      isError && styles.errorCard
    ]}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.headerContainer}
        activeOpacity={0.7}
      >
        <View style={styles.questionContainer}>
          {topic && topic !== 'General' && topic !== 'NA' && (
            <View style={styles.topicContainer}>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          )}
          
          <Text
            style={styles.questionText}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {question}
          </Text>
          
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#888"
            />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.answerContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Processing your question...</Text>
            </View>
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
            // <TypewriterText
            //   text={answer}
            //   typingSpeed={0} // Set to 0 for instant display or higher for typing effect
            //   markdownStyles={markdownStyles}
            // />
            <Markdown style={markdownStyles}>
                {answer}
            </Markdown>
          )}

          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={onDelete}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color="#d9534f" />
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    padding: 16,
    alignItems: 'flex-start',
  },
  questionContainer: {
    flex: 1,
  },
  topicContainer: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  topicText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 21,
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
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
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

export default QuestionCard;