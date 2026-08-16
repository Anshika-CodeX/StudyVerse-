import { GeminiAdapter } from './gemini.adapter';
// import { ClaudeAdapter } from './claude.adapter'; // Future

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IAIService {
  streamCompletion(
    messages: ChatMessage[], 
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: any) => void
  ): Promise<void>;
}

class AIService {
  private activeProvider: IAIService;

  constructor() {
    // We are now using Gemini as the default provider
    this.activeProvider = new GeminiAdapter();
  }

  public async streamChat(
    messages: ChatMessage[], 
    onToken: (token: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: any) => void
  ) {
    return this.activeProvider.streamCompletion(messages, onToken, onComplete, onError);
  }
}

export const aiService = new AIService();
