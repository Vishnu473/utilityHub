import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { ScrollView, StatusBar, View } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import queryClient from '../utils/askAI/queryClient';
import { useIdleReminder } from '@/hooks/useIdleReminder';
import { useCallback, useEffect } from 'react';
import Toast, { ToastProps } from 'react-native-toast-message';
import { CustomToast } from '@/components/custom/customToast';

export default function Layout() {

  const { resetTimer } = useIdleReminder();

  const handleUserActivity = useCallback(() => {
    Toast.hide();
    resetTimer();
  }, []);

  const toastConfig = {
    success: (props:ToastProps) => <CustomToast {...props} type="success" />,
    error: (props:ToastProps) => <CustomToast {...props} type="error" />,
    info: (props:ToastProps) => <CustomToast {...props} type="info" />,
    warning: (props:ToastProps) => <CustomToast {...props} type="warning" />,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TapGestureHandler onActivated={handleUserActivity}>
          <View style={{ flex: 1 }}>
            <SafeAreaProvider>
              <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
                <StatusBar backgroundColor="blue" barStyle="light-content" />
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  onScrollBeginDrag={handleUserActivity}
                  onTouchStart={handleUserActivity}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <View style={{ flex: 1 }}>
                    <Stack screenOptions={{ headerShown: false }} />
                  </View>
                </ScrollView>

                <Toast config={toastConfig} />
              </SafeAreaView>
            </SafeAreaProvider>
          </View>
        </TapGestureHandler>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
