import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import vaultDataJson from '@/data/vault.json'
import * as Clipboard from "expo-clipboard"
import CustomNavbar from '@/components/custom/customNavBar'

const colors = {
  background: '#FFFFFF',
  cardBg: '#F0F7FF',
  cardBorder: '#D0E1F9',
  primaryText: '#0A4D82',
  secondaryText: '#3280BA',
  accentColor: '#2C6EB0',
  lightText: '#64A0D0',
  shadowColor: '#AECDF4',
  danger: '#DC2626',
}

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

const VaultDetail = () => {
  const router = useRouter()
  const vaultData: Vault[] = vaultDataJson; 
  const { id } = useLocalSearchParams()
  const [vault, setVault] = useState<Vault | null>(null);
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (id) {
      const foundVault = vaultData.find(item => item.id === id)
      if (foundVault) {
        setVault(foundVault);
      }
    }
  }, [id]);

  if (!vault) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Item not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleEdit = () => {
    if (vault) {
      router.push({
        pathname: '/vault/addNewVault',
        params: { 
          mode: 'edit', 
          id: vault.id 
        }
      });
    }
  };

  const handleCopy = async (copiedText: string) => {
    await Clipboard.setStringAsync(copiedText);
  }

  const handleOpenLink = async (url: string) => {
    let validUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = `https://${url}`;
    }

    try {
      await Linking.openURL(validUrl);
    } catch (error) {
      console.error('Could not open URL:', error);
    }
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            //delete logic here
            router.replace('/vaultHome')
          }
        }
      ]
    )
  }

  const ActionButtons = () => (
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="#5B21B6" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      
      <CustomNavbar title='Vault Details' bgColor={colors.cardBg} textColor={colors.primaryText}
        showBackButton={true}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.itemHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={24} color={colors.primaryText} />
          </View>
          <Text style={styles.title}>{vault.title}</Text>
          <Text style={styles.category}>{vault.category}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Credentials</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{vault.username}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={() => handleCopy(vault.username ?? '')}>
                <Ionicons name="copy-outline" size={18} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.valueContainer}>
            <TouchableOpacity
                onPress={() => handleCopy(vault.password ?? '')}
              >
                
              <Text style={styles.value}>
                {showPassword ? vault.password : '••••••••••••••'}
              </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
              
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.label}>Website</Text>
            <View style={styles.valueContainer}>
              <Text style={styles.value}>{vault.website}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={() => handleOpenLink(vault.website)}>
                <Ionicons name="open-outline" size={18} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>
            {vault.notes || "No additional notes for this entry."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.securityInfo}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.securityText}>Password strength: Strong</Text>
          </View>
          <View style={styles.securityInfo}>
            <Ionicons name="time-outline" size={20} color={colors.secondaryText} />
            <Text style={styles.securityText}>Last updated: 3 days ago</Text>
          </View>
        </View>

        <ActionButtons />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
  },
  editBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primaryText,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.secondaryText,
    backgroundColor: colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  label: {
    fontSize: 14,
    color: colors.lightText,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 14,
    color: colors.secondaryText,
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    color: colors.secondaryText,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  editButtonText: {
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: colors.primaryText,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
})

export default VaultDetail