import {
    View, Text, TouchableOpacity, FlatList,
    StyleSheet, KeyboardAvoidingView, Platform, Alert, Keyboard,
    ActivityIndicator
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AskAI } from '@/types/askAiTypes';
import * as Clipboard from "expo-clipboard"
import ChatInput from '@/components/askAI/ChatInput';
import ChatTopicSelector from '@/components/askAI/ChattopicSelector';
import QuestionCard from '@/components/askAI/qusetionCard';
import Toast from 'react-native-toast-message';
import FullScreenLoader from '@/components/custom/FullScreenLoader';
import { exportPdfNShare } from '@/utils/askAI/exportPdfNShare';
import { useAskAIChat } from '@/hooks/useAskAIChat';

const AskAIDashboard = () => {
    const [text, setText] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();
    const [exporting, setExporting] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const {
        askAIList,
        ask,
        retryQuestion,
        lastQuestionError,
        deleteQuestion,
        clearAll,
        isPending,
        isError,
        error,
        initialDataLoaded,
        refreshData
    } = useAskAIChat();

    console.log(isPending);
    

    // If there was an error with the last question, put it back in the input
    useEffect(() => {
        if (lastQuestionError) {
            setText(lastQuestionError);
        }
    }, [lastQuestionError]);

    // Handle errors from the hook
    useEffect(() => {
        if (isError && error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Something went wrong'
            });
        }
    }, [isError, error]);

    // Scroll to the bottom when new content is added
    useEffect(() => {
        if (askAIList.length > 0) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({
                    animated: true,
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [askAIList.length]);

    // Pull to refresh functionality
    const handleRefresh = async () => {
        try {
            setIsRefreshing(true);
            await refreshData();
            setIsRefreshing(false);
            Toast.show({
                type: 'success',
                text1: 'Data refreshed',
            });
        } catch (error) {
            setIsRefreshing(false);
            console.log('Error refreshing data:', error);
            Toast.show({
                type: 'error',
                text1: 'Refresh failed',
                text2: 'Could not refresh data'
            });
        }
    };

    const handleSubmit = async () => {
        if (text.trim()) {
            Keyboard.dismiss();
            try {
                await ask(text, selectedTopic);
                setText('');
                setSelectedTopic(null);
            } catch (error) {
                // Error is already handled in the hook and via the error effect
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

    const handleCopy = async(id: string) => {
        const selected = askAIList.find(item => item.id === id);
        if (selected?.answer) {
            await Clipboard.setStringAsync(selected.answer);
            Toast.show({
                type: 'success',
                text1: 'Copied to clipboard',
            });
        }
    }

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

    const handleExport = async () => {
        if (askAIList.length === 0) {
            Toast.show({ type: 'info', text1: 'No AskAI entries to export' });
            return;
        }

        setExporting(true);
        try {
            const exported = await exportPdfNShare(askAIList);
            if (!exported) {
                Toast.show({ type: 'info', text1: 'No AskAI entries to export' });
            }
        } catch (error) {
            console.error("Export failed:", error);
            Toast.show({ 
                type: 'error', 
                text1: 'Export failed',
                text2: 'Could not export data'
            });
        } finally {
            setExporting(false);
        }
    }

    const showNewChatNotice = askAIList.length >= 40;

    // Render header component for FlatList
    // const renderListHeader = () => {
    //     return (
    //         <>
    //             <View style={styles.headerRow}>
    //                 <Text style={styles.headerText}>Ask AI</Text>
    //                 <TouchableOpacity
    //                     style={styles.exportButton}
    //                     onPress={handleExport}
    //                     disabled={askAIList.length === 0}
    //                 >
    //                     <Ionicons name="document" size={18} color={askAIList.length === 0 ? "#A0C0E0" : "#007AFF"} />
    //                     <Text style={[styles.exportButtonText, askAIList.length === 0 && styles.disabledText]}>Export</Text>
    //                 </TouchableOpacity>
    //                 <TouchableOpacity
    //                     style={styles.clearButton}
    //                     onPress={handleClearAll}
    //                     disabled={askAIList.length === 0}
    //                 >
    //                     <Ionicons name="trash-outline" size={18} color={askAIList.length === 0 ? "#E0A0A0" : "#d9534f"} />
    //                     <Text style={[styles.clearButtonText, askAIList.length === 0 && styles.disabledClearText]}>Clear All</Text>
    //                 </TouchableOpacity>
    //             </View>

    //             {askAIList.length === 0 && initialDataLoaded &&
    //                 <View style={styles.emptyState}>
    //                     <Ionicons name="chatbubble-ellipses-outline" size={50} color="#ccc" />
    //                     <Text style={styles.emptyStateText}>
    //                         Ask me anything! Start a conversation by typing your question below.
    //                     </Text>
    //                 </View>
    //             }

    //             {showNewChatNotice && (
    //                 <View style={styles.noticeContainer}>
    //                     <Ionicons name="information-circle-outline" size={16} color="#888" />
    //                     <Text style={styles.notice}>
    //                         You've reached 40 entries. Older entries will be removed when new ones are added.
    //                     </Text>
    //                 </View>
    //             )}
    //         </>
    //     );
    // };

    // Enable item identifier to ensure correct rendering
    const keyExtractor = (item: AskAI) => item.id;
    // Render individual list item with memoization
    const renderItem = React.useCallback(({ item }: { item: AskAI }) => (
        <QuestionCard
            key={item.id}
            askAI={item}
            onCopy={() => handleCopy(item.id)}
            onDelete={() => handleDelete(item.id)}
            onRetry={item.status === 'error' ? () => handleRetry(item.question) : () => { }}
        />
        
    ), []);

    // Show loading spinner during initial data load
    if (!initialDataLoaded) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading your questions...</Text>
            </View>
        );
    }

    const handleLoadMore = async () => {
        if (!isPending && askAIList.length > 0) {
            try {
                setIsRefreshing(true); // Show loading spinner while fetching
                await refreshData(); // Fetch previous batch of data
                setIsRefreshing(false);
            } catch (error) {
                setIsRefreshing(false);
                console.error("Error loading more data:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Load More Failed',
                    text2: 'Could not load previous questions.'
                });
            }
        }
    };    

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingBottom: insets.bottom }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <FullScreenLoader visible={exporting} />
            <>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Ask AI</Text>
                    <TouchableOpacity
                        style={styles.exportButton}
                        onPress={handleExport}
                        disabled={askAIList.length === 0}
                    >
                        <Ionicons name="document" size={18} color={askAIList.length === 0 ? "#A0C0E0" : "#007AFF"} />
                        <Text style={[styles.exportButtonText, askAIList.length === 0 && styles.disabledText]}>Export</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearAll}
                        disabled={askAIList.length === 0}
                    >
                        <Ionicons name="trash-outline" size={18} color={askAIList.length === 0 ? "#E0A0A0" : "#d9534f"} />
                        <Text style={[styles.clearButtonText, askAIList.length === 0 && styles.disabledClearText]}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {askAIList.length === 0 && initialDataLoaded &&
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubble-ellipses-outline" size={50} color="#ccc" />
                        <Text style={styles.emptyStateText}>
                            Ask me anything! Start a conversation by typing your question below.
                        </Text>
                    </View>
                }

                {showNewChatNotice && (
                    <View style={styles.noticeContainer}>
                        <Ionicons name="information-circle-outline" size={16} color="#888" />
                        <Text style={styles.notice}>
                            You've reached 40 entries. Older entries will be removed when new ones are added.
                        </Text>
                    </View>
                )}
            </>
            {/* <FlatList
                ref={flatListRef}
                data={askAIList}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={renderListHeader}
                removeClippedSubviews={true}
                initialNumToRender={10}
                keyboardShouldPersistTaps="handled"
                maxToRenderPerBatch={5}
                contentContainerStyle={[styles.listContent]}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                  }}
                extraData={isPending} // Re-render when loading state changes
                
            /> */}

<FlatList
    ref={flatListRef}
    data={askAIList}
    renderItem={renderItem}
    keyExtractor={keyExtractor}
    removeClippedSubviews={true}
    initialNumToRender={10}
    keyboardShouldPersistTaps="handled"
    maxToRenderPerBatch={5}
    contentContainerStyle={[styles.listContent]}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onRefresh={handleRefresh}
    refreshing={isRefreshing}
    maintainVisibleContentPosition={{
        minIndexForVisible: 0,
    }}
    extraData={isPending}
    onEndReached={handleLoadMore}  // Trigger when the top is reached
    onEndReachedThreshold={0.1}  // Set this to trigger when nearing the top
/>


            <View style={styles.inputContainer}>
                {isPending && !isRefreshing && (
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
        backgroundColor: '#fefefe'
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        flexGrow: 1,
        backgroundColor: '#fff',
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
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 2,
        borderColor: '#cacaca'
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
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    exportButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#007AFF',
        marginLeft: 4,
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
        borderBottomWidth: 1,
        borderColor: '#d1d1d1',
        paddingTop:10,
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
    disabledText:{

    },
    disabledClearText:{

    }
});

export default AskAIDashboard;