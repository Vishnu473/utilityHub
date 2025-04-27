import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import vaultDataJson from '@/data/vault.json';
import CustomNavbar from '@/components/custom/customNavBar';

type Vault = {
  id: string;
  title: string;
  username?: string;
  email?:string;
  mobile?:string;
  password: string;
  category: string;
  website: string;
  notes: string;
};

const colors = {
  background: '#FFFFFF',
  cardBg: '#F0F7FF',
  cardBorder: '#D0E1F9',
  primaryText: '#0A4D82',
  secondaryText: '#3280BA',
  placeholderText: '#64A0D0',
  inputBg: '#FFFFFF',
  buttonBg: '#0A4D82',
  buttonText: '#FFFFFF',
  disabledBg: '#D0E1F9',
  shadowColor: '#AECDF4',
};

const categories = [
  'Finance',
  'Social',
  'Work',
  'Personal',
  'Other'
];

const VaultItemScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = Boolean(params.id);
  const vaultData: Vault[] = vaultDataJson; 
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    website: 'https://',
    category: '',
    notes: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If we're editing, fetch the item data from vault.json
    if (isEditing && params.id && Array.isArray(vaultData) && vaultData.length > 0) {
      const existingItem = vaultData.find(item => item.id === params.id);
      
      if (existingItem) {
        setFormData({
          title: existingItem.title || '',
          username: existingItem.username || '',
          password: existingItem.password || '',
          website: existingItem.website || 'https://',
          category: existingItem.category || '',
          notes: existingItem.notes || ''
        });
      }
    }
  }, [isEditing, params.id, vaultData]);

  const updateFormField = (field: string, value: string) => {
    let processedValue = value;
    if (field === 'website' && value && !value.startsWith('http://') && !value.startsWith('https://')) {
      processedValue = `https://${value}`;
    }
    setFormData({
      ...formData,
      [field]: processedValue
    });
  };

  const isFormValid = () => {
    return formData.title && formData.username && formData.password;
  };

  const handleSave = () => {
    if (!isFormValid()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Here we would add logic to save the data to vault.json
    // For now, just simulating a successful save
    Alert.alert(
      'Success',
      isEditing ? 'Item updated successfully' : 'Item saved to vault',
      [
        {
          text: 'OK',
          onPress: () => {
            if (isEditing) {
              router.back();
            } else {
              router.replace('/vaultHome');
            }
          }
        }
      ]
    );
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    updateFormField('password', password);
    setShowPassword(true);
  };

  const renderSaveButton = () => (
    <TouchableOpacity
      onPress={handleSave}
      disabled={!isFormValid()}
    >
      <Text style={[
        styles.navBarButtonText,
        !isFormValid() && styles.navBarButtonDisabled
      ]}>Save</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <CustomNavbar 
        title={isEditing ? "Edit Item" : "Add New Item"} 
        bgColor={colors.cardBg}
        textColor={colors.primaryText}
        showBackButton={true}
        rightIcon={renderSaveButton()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              placeholderTextColor={colors.placeholderText}
              value={formData.title}
              onChangeText={(text) => updateFormField('title', text)}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Username / Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username or email"
              placeholderTextColor={colors.placeholderText}
              value={formData.username}
              onChangeText={(text) => updateFormField('username', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                placeholderTextColor={colors.placeholderText}
                value={formData.password}
                onChangeText={(text) => updateFormField('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordVisibilityButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePassword}
            >
              <Ionicons name="refresh" size={16} color={colors.buttonText} />
              <Text style={styles.generateButtonText}>Generate Strong Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter website URL"
              placeholderTextColor={colors.placeholderText}
              value={formData.website}
              onChangeText={(text) => updateFormField('website', text)}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    formData.category === category && styles.categoryChipSelected
                  ]}
                  onPress={() => updateFormField('category', category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      formData.category === category && styles.categoryChipTextSelected
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any additional information"
              placeholderTextColor={colors.placeholderText}
              value={formData.notes}
              onChangeText={(text) => updateFormField('notes', text)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                !isFormValid() && styles.saveBtnDisabled
              ]}
              onPress={handleSave}
              disabled={!isFormValid()}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.primaryText,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.primaryText,
  },
  passwordVisibilityButton: {
    padding: 10,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryText,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  generateButtonText: {
    color: colors.buttonText,
    fontWeight: '500',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  categoryChip: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipSelected: {
    backgroundColor: colors.primaryText,
    borderColor: colors.primaryText,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  categoryChipTextSelected: {
    color: colors.buttonText,
  },
  bottomButtonContainer: {
    marginTop: 16,
  },
  saveBtn: {
    backgroundColor: colors.buttonBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveBtnDisabled: {
    backgroundColor: colors.disabledBg,
  },
  saveBtnText: {
    color: colors.buttonText,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 16,
  },
  navBarButtonText: {
    color: colors.buttonBg,
    fontWeight: '600',
    fontSize: 16,
  },
  navBarButtonDisabled: {
    color: colors.placeholderText,
  }
});

export default VaultItemScreen;