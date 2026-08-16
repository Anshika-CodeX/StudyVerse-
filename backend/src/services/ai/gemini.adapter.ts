import { GoogleGenAI } from '@google/genai';
import { IAIService, ChatMessage } from './ai.service';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class GeminiAdapter implements IAIService {
  async streamCompletion(
    messages: ChatMessage[],
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      const systemInstruction = `You are the StudyVerse AI Tutor, an expert Data Structures and Algorithms instructor.
You provide clear, highly educational, and beautifully formatted responses in Markdown.
When writing code, always specify the language (e.g., \`\`\`javascript). Keep explanations concise but highly engaging.

CRITICAL REQUIREMENT:
If the user asks a Data Structures or Algorithms (DSA) question (e.g., about Arrays, Stacks, Queues, Linked Lists, Trees, Graphs, Sorting, etc.), you MUST append a strict JSON block at the very end of your response. 
DO NOT put the JSON block in the middle of your response. It must be at the very end, wrapped in \`\`\`json.

The JSON MUST follow this exact structure (populate only the relevant state array, e.g., 'arrayState' for arrays):
\`\`\`json
{
  "dsa_visualizer": {
    "topic": "Array", // Can be "Array", "Stack", "Queue", "LinkedList", "Tree", "Graph"
    "operation": "Reverse Array",
    "question": "The question being solved",
    "complexity": { "time": "O(N)", "space": "O(1)" },
    "notes": ["Note 1"],
    "edgeCases": ["Edge case 1"],
    "interviewQuestions": ["Variation 1"],
    "practiceProblems": ["Problem 1"],
    "code": "function()...",
    "language": "javascript",
    "steps": [
      {
        "arrayState": [10, 20, 30], // Use stackState, queueState, etc., based on topic
        "currentIndexes": [0, 2],
        "activeIndexes": [],
        "variables": { "i": 0, "j": 2 },
        "explanation": "Step explanation",
        "codeLine": 2
      }
    ]
  }
}
\`\`\`
If the query is NOT about a DSA problem (e.g., general conversation, "What is 2+2?", "Explain React"), DO NOT include the JSON block.`;

      // Convert standard messages format to Gemini format
      const geminiMessages = messages.map(msg => {
        // Map 'assistant' and 'system' to 'model', 'user' to 'user'
        const role = msg.role === 'user' ? 'user' : 'model';
        return {
          role,
          parts: [{ text: msg.content }]
        };
      });

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: geminiMessages,
        config: {
          systemInstruction,
        }
      });

      let fullResponse = '';

      for await (const chunk of responseStream) {
        const token = chunk.text || '';
        if (token) {
          fullResponse += token;
          onToken(token);
        }
      }

      onComplete(fullResponse);
    } catch (error) {
      console.error('Gemini Error:', error);
      onError(error);
    }
  }
}
