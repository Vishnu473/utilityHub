import { Stack} from 'expo-router';
import { StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Stack screenOptions={{headerShown:false}}/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}