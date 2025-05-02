import { useEffect, useRef } from 'react';
import { AppState, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';

const IDLE_TIME = 24*60* 1000; // 15 minutes

export const useIdleReminder = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showIdleToast = () => {
    Toast.show({
        type: 'warning',
        text1: '⚠️ You’ve been inactive',
        text2: 'Tap anywhere to continue',
        position: 'top',
        autoHide: false,
        topOffset: 60,
      });      
  };

  const resetTimer = () => {
    // console.log('⏱️ Timer reset');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
        // console.log('🚨 Inactive – showing toast');
        showIdleToast();
      }, IDLE_TIME);
  };

  useEffect(() => {
    resetTimer();

    const subs = [
      AppState.addEventListener('change', resetTimer),
      Keyboard.addListener('keyboardDidShow', resetTimer),
      Keyboard.addListener('keyboardDidHide', resetTimer),
    ];

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      subs.forEach(sub => sub.remove());
    };
  }, []);

  return { resetTimer };
};
