import { AskAI } from '@/types/askAiTypes';
import { marked } from 'marked';

export const generateAIHtmlContent = (askAIList: AskAI[]): string => {
  const rows = askAIList.map((item, index) => {
    
    const question = marked.parse(item.question);
    const answer = marked.parse(item.answer);

    return `
      <div style="margin-bottom: 24px; border-bottom: 1px solid #c3c3c3">
        <h3>Q${index + 1}. ${question}</h3>
        <h4>Answer:</h4>
        <div>${answer}</div>
      </div>
    `;
  });

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
                @page {
            margin: 40px; /* Adjust as needed */
          }
          body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
          }
          h3, h4 { color:rgb(4, 10, 18); }
          div { margin-bottom: 10px; color:rgb(52, 53, 54); }
        </style>
      </head>
      <body>
        <h2>Ask AI - Exported Chats</h2>
        ${rows.join('')}
      </body>
    </html>
  `;
};
