import {
    View, Text, TouchableOpacity, FlatList,
    StyleSheet, KeyboardAvoidingView, Platform, Alert, Keyboard,
    ActivityIndicator
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useAskAI } from '@/hooks/useAskAI';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AskAI } from '@/types/askAiTypes';
import ChatInput from '@/components/askAI/ChatInput';
import ChatTopicSelector from '@/components/askAI/ChattopicSelector';
import QuestionCard from '@/components/askAI/qusetionCard';

const AskAIDashboard = () => {
    const [text, setText] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    const {
        askAIList,
        ask,
        retryQuestion,
        lastQuestionError,
        deleteQuestion,
        clearAll,
        isPending,
    } = useAskAI();

    // If there was an error with the last question, put it back in the input
    useEffect(() => {
        if (lastQuestionError) {
            setText(lastQuestionError);
        }
    }, [lastQuestionError]);

    // Scroll to the bottom when new content is added
    useEffect(() => {
        if (askAIList.length > 0) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [askAIList.length]);

    const handleSubmit = async () => {
        if (text.trim()) {
            Keyboard.dismiss();
            try {
                await ask(text, selectedTopic);
                setText('');
                setSelectedTopic(null);
            } catch (error) {
                // Error is already handled in the hook
                console.log('Error caught in component:', error);
            }
        }
    };

    const handleRetry = async (question: string) => {
        setText('');
        try {
            await retryQuestion(question, selectedTopic);
        } catch (error) {
            console.log('Error during retry:', error);
        }
    };

    const handleDelete = (id: string) => {
        deleteQuestion(id);
        if (expandedId === id) setExpandedId(null);
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Questions',
            'This will remove all your saved questions and answers. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => clearAll()
                },
            ]
        );
    };

    const showNewChatNotice = askAIList.length >= 40;

    // Render header component for FlatList
    const renderListHeader = () => {
        if (askAIList.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <Ionicons name="chatbubble-ellipses-outline" size={50} color="#ccc" />
                    <Text style={styles.emptyStateText}>
                        Ask me anything! Start a conversation by typing your question below.
                    </Text>
                </View>
            );
        }

        return (
            <>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Your Chat Assistant</Text>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearAll}
                    >
                        <Ionicons name="trash-outline" size={18} color="#d9534f" />
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {showNewChatNotice && (
                    <View style={styles.noticeContainer}>
                        <Ionicons name="information-circle-outline" size={16} color="#888" />
                        <Text style={styles.notice}>
                            You've reached 40 entries. Older entries will be removed when new ones are added.
                        </Text>
                    </View>
                )}
            </>
        );
    };

    // Render individual list item
    const renderItem = ({ item }: { item: AskAI }) => (
        <QuestionCard
            key={item.id}
            askAI={item}
            isExpanded={expandedId === item.id}
            onToggle={() => setExpandedId(prev => (prev === item.id ? null : item.id))}
            onDelete={() => handleDelete(item.id)}
            onRetry={item.status === 'error' ? () => handleRetry(item.question) : () => { }}
        />
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingBottom: insets.bottom }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FlatList
                ref={flatListRef}
                data={askAIList}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderListHeader}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onScrollToIndexFailed={() => {
                    // Fallback for scrollToIndex failures
                    setTimeout(() => {
                        if (askAIList.length > 0 && flatListRef.current) {
                            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
                        }
                    }, 100);
                }}
            />

            <View style={styles.inputContainer}>
                {isPending && (
                    <View style={styles.loadingIndicator}>
                        <ActivityIndicator size="small" color="#007AFF" />
                        <Text style={styles.loadingText}>Processing your question...</Text>
                    </View>
                )}

                <ChatInput
                    text={text}
                    onChangeText={setText}
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    placeholder="Ask me anything..."
                />

                <ChatTopicSelector
                    selectedTopic={selectedTopic}
                    onSelectTopic={setSelectedTopic}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    listContent: {
        padding: 16,
        paddingBottom: 30,
        flexGrow: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        height: 300,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 16,
        maxWidth: '80%',
    },
    inputContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eaeaea',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff0f0',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    clearButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#d9534f',
        marginLeft: 4,
    },
    noticeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    notice: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    separator: {
        borderBottomWidth:1,
        borderColor:'#d1d1d1',
    },
    loadingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#f0f7ff',
        padding: 8,
        borderRadius: 8,
    },
    loadingText: {
        fontSize: 13,
        color: '#007AFF',
        marginLeft: 8,
    },
});

export default AskAIDashboard;