import { AskAI } from '@/types/askAiTypes'
import Toast from 'react-native-toast-message'
import RNHTMLtoPdf from 'react-native-html-to-pdf'
import * as Sharing from 'expo-sharing'
import { generateAIHtmlContent } from './generateAIHtmlContent';

export const exportPdfNShare = async (askAIList: AskAI[]): Promise<boolean> => {
  if (askAIList.length === 0) {
    Toast.show({
      type: 'info',
      text1: 'Export Skipped',
      text2: 'No content to export.',
    });
    return false;
  }

  try {
    const htmlContent = generateAIHtmlContent(askAIList);
    
    const file = await RNHTMLtoPdf.convert({
      html: htmlContent,
      fileName: `askAIList_UtilityHub_${Date.now()}`,
      base64: false,
    });
     
    if (file.filePath && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(`file://${file.filePath}`);
    } else {
      Toast.show({
        type: 'success',
        text1: 'PDF Created',
        text2: 'Saved at ' + file.filePath,
      });
    }

    return true;
  } catch (error) {
    console.error('Export error:', error);
    Toast.show({
      type: 'error',
      text1: 'Export Failed',
      text2: 'Something went wrong while exporting.',
    });
    return false;
  }
};
