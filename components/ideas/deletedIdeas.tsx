import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useDeletedIdeas } from '@/hooks/useDeletedIdeas'
import { useFocusEffect } from '@react-navigation/native';
import DeletedIdeaItem from '@/components/ideas/deleteIdeaItem';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@/components/common/checkBox';

const DeletedIdeas = ({ onItemsDeleted, onItemsRecovered }:{onItemsDeleted:() => void,onItemsRecovered:() => void}) => {
    const { deletedIdeas, refreshDeletedIdeas, undeleteIdea, permanentlyDeleteIdea } = useDeletedIdeas();
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
    const [selectAll, setSelectAll] = useState(false);

    useFocusEffect(
        useCallback(() => {
            refreshDeletedIdeas();
            // Reset selection state when screen is focused
            setSelectedItems({});
            setSelectAll(false);
        }, [])
    );

    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        
        const newSelectedItems: Record<string, boolean> = {};
        if (newSelectAll) {
            deletedIdeas.forEach(item => {
                newSelectedItems[item.id] = true;
            });
        }
        setSelectedItems(newSelectedItems);
    };

    const toggleSelectItem = (id:string) => {
        setSelectedItems(prev => {
            const newSelectedItems = { ...prev };
            
            if (newSelectedItems[id]) {
                delete newSelectedItems[id];
            } else {
                newSelectedItems[id] = true;
            }
            
            // Update selectAll state based on selection
            setSelectAll(Object.keys(newSelectedItems).length === deletedIdeas.length);
            
            return newSelectedItems;
        });
    };

    const getSelectedIds = () => {
        return Object.keys(selectedItems);
    };

    const handleUnDelete = async () => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;
    
    try {
        // Store the count of items being recovered
        const recoveredCount = selectedIds.length;
        
        // Perform recovery
        for (const id of selectedIds) {
            await undeleteIdea(id);
        }
        
        // Clear selection after recovery
        setSelectedItems({});
        setSelectAll(false);
        
        // Refresh the lists
        await refreshDeletedIdeas();
        
        // Ensure parent components are updated
        if (onItemsRecovered) onItemsRecovered();
        if (onItemsDeleted) onItemsDeleted(); // Also notify about deleted items change
        
    } catch (error) {
        console.error("Error recovering items:", error);
    }
};

    const handlePermenantDelete = async () => {
        const selectedIds = getSelectedIds();
        if (selectedIds.length === 0) return;
        
        try {
            for (const id of selectedIds) {
                await permanentlyDeleteIdea(id);
            }
            setSelectedItems({});
            setSelectAll(false);
            refreshDeletedIdeas();

            if (onItemsDeleted) onItemsDeleted();
        } catch (error) {
            console.error("Error permanently deleting items:", error);
        }
    };

    const renderSelectAllHeader = () => {
        if (!deletedIdeas || deletedIdeas.length === 0) return null;
        
        return (
            <View style={styles.selectAllContainer}>
                <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
                    <CheckBox
                        checked={selectAll} 
                        onPress={toggleSelectAll}
                        size={20}
                    />
                    <Text style={styles.selectAllText}>Select All</Text>
                </TouchableOpacity>
                <Text style={styles.selectionCountText}>
                    {Object.keys(selectedItems).length} of {deletedIdeas.length} selected
                </Text>
            </View>
        );
    };

    const ActionButtons = () => {
        const selectedCount = Object.keys(selectedItems).length;
        
        return (
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={[styles.recoverButton, selectedCount === 0 && styles.buttonDisabled]}
                    onPress={handleUnDelete}
                    disabled={selectedCount === 0}
                >
                    <Ionicons name="refresh-outline" size={20} color={selectedCount === 0 ? "#9CA3AF" : "#5B21B6"} />
                    <Text style={[styles.recoverButtonText, selectedCount === 0 && styles.buttonTextDisabled]}>
                        Recover {selectedCount > 0 ? `(${selectedCount})` : ''}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.deleteButton, selectedCount === 0 && styles.buttonDisabled]}
                    onPress={handlePermenantDelete}
                    disabled={selectedCount === 0}
                >
                    <Ionicons name="trash" size={20} color={selectedCount === 0 ? "#9CA3AF" : "#DC2626"} />
                    <Text style={[styles.deleteButtonText, selectedCount === 0 && styles.buttonTextDisabled]}>
                        Delete {selectedCount > 0 ? `(${selectedCount})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {deletedIdeas && Array.isArray(deletedIdeas) && deletedIdeas.length > 0 ? (
                <View style={styles.contentContainer}>
                    <Text style={styles.headerText}>Select the ideas to recover:</Text>
                    
                    {renderSelectAllHeader()}
                    
                    <FlatList
                        data={deletedIdeas}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <DeletedIdeaItem 
                                idea={item}
                                isSelected={!!selectedItems[item.id]}
                                onToggleSelect={() => toggleSelectItem(item.id)}
                            />
                        )}
                        style={styles.list}
                    />

                    <ActionButtons />
                </View>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No deleted ideas to recover.</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        backgroundColor:'#F5F3FF',
        paddingHorizontal:20
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 12,
    },
    list: {
        flex: 1,
    },
    selectAllContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginBottom: 8,
    },
    selectAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    selectionCountText: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#5B21B6',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
        marginBottom: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    recoverButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F3FF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DDD6FE',
    },
    recoverButtonText: {
        color: '#5B21B6',
        fontWeight: '600',
        marginLeft: 6,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    deleteButtonText: {
        color: '#DC2626',
        fontWeight: '600',
        marginLeft: 6,
    },
    buttonDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    buttonTextDisabled: {
        color: '#9CA3AF',
    },
});

export default DeletedIdeas;