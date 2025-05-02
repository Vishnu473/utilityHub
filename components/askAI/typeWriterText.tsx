import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-native-markdown-display';
import { ScrollView, StyleSheet } from 'react-native';

interface TypewriterTextProps {
  text: string;
  typingSpeed?: number;
  markdownStyles?: any;
  onScroll?: () => void;
  scrollViewRef?: React.RefObject<ScrollView>;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  typingSpeed = 15, 
  markdownStyles 
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const textRef = useRef<string>(text);
  const indexRef = useRef<number>(0);
  useEffect(() => {
    textRef.current = text;
    indexRef.current = 0;
    setDisplayedText('');
    
    if (!text) return;
    
    const updateText = () => {
      if (indexRef.current < textRef.current.length) {
        setDisplayedText(prev => textRef.current.substring(0, indexRef.current + 1));
        indexRef.current += 1;
        setTimeout(updateText, typingSpeed);
      }
    };
    
    setTimeout(updateText, typingSpeed);
  }, [text, typingSpeed]);

  return (
    <Markdown style={markdownStyles}>
      {displayedText || 'Welcome to Gemini'}
    </Markdown>
  );
};

export default TypewriterText;
