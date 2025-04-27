import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIdeas } from '@/hooks/useIdeas';
import { generateIdeaId } from '@/types/ideaTypes';
import { useFocusEffect } from '@react-navigation/native';
import CustomNavbar from '@/components/custom/customNavBar';

const CATEGORIES = [
  "Social",
  "Healthcare",
  "Groceries",
  "Sports",
  "Fitness",
  "Education",
  "Entertainment",
  "Technology",
  "Finance",
  "Other"
];

const IdeasNew = () => {
  const router = useRouter();
  const { mode, id } = useLocalSearchParams<{ mode: string, id: string }>();
  const isEditMode = mode === 'edit';

  const { loading, addIdea, updateIdea, ideas } = useIdeas();

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [currentTool, setCurrentTool] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (isEditMode && id && Array.isArray(ideas) && ideas.length > 0) {
      const ideaToEdit = ideas.find(item => item.id === id);
      if (ideaToEdit) {
        setTitle(ideaToEdit.title || '');
        setPurpose(ideaToEdit.purpose || '');
        setDescription(ideaToEdit.description || '');
        setCategory(ideaToEdit.category || '');
        setTools(ideaToEdit.tools || []);
      }
    }
  }, [isEditMode, id, ideas]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your idea');
      return;
    }

    if (!purpose.trim()) {
      Alert.alert('Error', 'Please enter a purpose for your idea');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter small description for your idea');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category for your idea');
      return;
    }

    const ideaData = {
      id: isEditMode ? id : `idea-${generateIdeaId()}`,
      title,
      purpose,
      description,
      category,
      tools,
      deletedAt:null,
      createdAt: isEditMode ? ideas.find(item => item.id === id)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };

    if (isEditMode) {
      console.log(`Updating ${ideaData.id} into local storage......`);
      await updateIdea(ideaData);
    } else {
      console.log('Idea data:', ideaData);
      console.log("Saving into local storage......");
      await addIdea(ideaData);
      console.log("Saved successfully.....");
    }
    Alert.alert('Success', `Your idea has been ${isEditMode ? 'updated' : 'saved'}!`, [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const addTool = () => {
    if (currentTool.trim()) {
      setTools([...tools, currentTool.trim()]);
      setCurrentTool('');
      Keyboard.dismiss();
    }
  };

  const removeTool = (index: number) => {
    const updatedTools = [...tools];
    updatedTools.splice(index, 1);
    setTools(updatedTools);
  };

  const SaveButton = () => (
    <TouchableOpacity onPress={handleSubmit} disabled={loading}>
      <Ionicons name="checkmark" size={24} color="#5B21B6" />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <CustomNavbar
        title={isEditMode ? "Edit Idea" : "New Idea"}
        rightIcon={<SaveButton />}
      />
      {loading ? <ActivityIndicator color="#0A4D82" style={styles.loader} /> :
        <>
          <ScrollView
            style={styles.content}
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter idea title"
              maxLength={50}
            />

            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="What's the purpose of this idea?"
              maxLength={100}
            />

            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={category ? styles.categoryText : styles.placeholderText}>
                {category || "Select a category"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#5B21B6" />
            </TouchableOpacity>

            <Text style={styles.label}>Tools Required</Text>
            <View style={styles.toolsInputContainer}>
              <TextInput
                style={styles.toolsInput}
                value={currentTool}
                onChangeText={setCurrentTool}
                placeholder="Add a tool or technology"
                returnKeyType="done"
                onSubmitEditing={addTool}
              />
              <TouchableOpacity style={styles.addButton} onPress={addTool}>
                <Ionicons name="add-circle" size={24} color="#5B21B6" />
              </TouchableOpacity>
            </View>

            {tools.length > 0 && (
              <View style={styles.toolsList}>
                <View style={styles.toolsChipContainer}>
                  {tools.map((tool, index) => (
                    <View key={index} style={styles.toolChip}>
                      <Text style={styles.toolText}>{tool}</Text>
                      <TouchableOpacity
                        style={styles.removeToolButton}
                        onPress={() => removeTool(index)}
                      >
                        <Ionicons name="close-circle" size={20} color="#6D28D9" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your idea in detail"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />

            <View style={styles.bottomPadding} />
          </ScrollView>

          <Modal
            visible={showCategoryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCategoryModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryItem,
                        category === item && styles.selectedCategory
                      ]}
                      onPress={() => {
                        setCategory(item);
                        setShowCategoryModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.categoryItemText,
                          category === item && styles.selectedCategoryText
                        ]}
                      >
                        {item}
                      </Text>
                      {category === item && (
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </>
      }
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loader: {
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#5B21B6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    minHeight: 150,
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  toolsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolsInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    marginLeft: 8,
    padding: 4,
  },
  toolsList: {
    marginVertical: 8,
  },
  toolsChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  toolText: {
    fontSize: 14,
    color: '#5B21B6',
    marginRight: 4,
  },
  removeToolButton: {
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#5B21B6',
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 50,
  }
});

export default IdeasNew;