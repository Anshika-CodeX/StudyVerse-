import { Request, Response } from 'express';
import { aiService, ChatMessage } from '../services/ai/ai.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Temporary mock user ID until auth is fully integrated on frontend
const MOCK_USER_ID = 'mock-user-123';

// Ensure the mock user exists for testing
async function ensureMockUser() {
  const user = await prisma.user.findUnique({ where: { id: MOCK_USER_ID } });
  if (!user) {
    await prisma.user.create({
      data: {
        id: MOCK_USER_ID,
        email: 'test@studyverse.ai',
        name: 'Test User'
      }
    });
  }
}

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    await ensureMockUser();
    const chats = await prisma.chat.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, isPinned: true, updatedAt: true }
    });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const messages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, content: true, createdAt: true }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createNewChat = async (req: Request, res: Response) => {
  try {
    await ensureMockUser();
    const chat = await prisma.chat.create({
      data: {
        userId: MOCK_USER_ID,
        title: 'New Conversation'
      }
    });
    res.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const streamChat = async (req: Request, res: Response) => {
  try {
    let { chatId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    message = message.trim();

    // --- DB Operations ---
    let chatHistory: ChatMessage[] = [];
    let dbAvailable = true;
    let resolvedChatId = chatId;

    try {
      await ensureMockUser();

      // Create a new chat if chatId is 'new' or missing
      if (!resolvedChatId || resolvedChatId === 'new') {
        // Auto-title from first message (max 40 chars)
        const autoTitle = message.length > 40
          ? message.substring(0, 40).trimEnd() + '…'
          : message;

        const newChat = await prisma.chat.create({
          data: { userId: MOCK_USER_ID, title: autoTitle }
        });
        resolvedChatId = newChat.id;
      }

      // Fetch existing conversation history (for context)
      const previousMessages = await prisma.message.findMany({
        where: { chatId: resolvedChatId },
        orderBy: { createdAt: 'asc' },
        select: { role: true, content: true }
      });

      // Map DB role 'assistant' to ChatMessage role 'assistant'
      chatHistory = previousMessages.map(msg => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: msg.content
      }));

      // Save the current user message
      await prisma.message.create({
        data: { chatId: resolvedChatId, role: 'user', content: message }
      });

      // Touch updatedAt on the chat
      await prisma.chat.update({
        where: { id: resolvedChatId },
        data: { updatedAt: new Date() }
      });

    } catch (dbError: any) {
      console.warn('⚠️  DB unavailable, running stateless:', dbError.message);
      dbAvailable = false;
      resolvedChatId = resolvedChatId || 'offline-' + Date.now();
    }

    // Build the full message array for Gemini (history + current user message)
    const allMessages: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', content: message }
    ];

    // --- Set SSE Headers ---
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send the resolved chatId to the client immediately
    res.write(`data: ${JSON.stringify({ type: 'meta', chatId: resolvedChatId })}\n\n`);

    // --- Stream Gemini response ---
    await aiService.streamChat(
      allMessages,
      (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
      async (fullResponse) => {
        // Save AI response and update chat timestamp
        if (dbAvailable && resolvedChatId && !resolvedChatId.startsWith('offline-')) {
          try {
            await prisma.message.create({
              data: { chatId: resolvedChatId, role: 'assistant', content: fullResponse }
            });
            await prisma.chat.update({
              where: { id: resolvedChatId },
              data: { updatedAt: new Date() }
            });
          } catch (e) {
            console.warn('Could not save AI response:', e);
          }
        }

        res.write(`data: [DONE]\n\n`);
        res.end();
      },
      (error) => {
        console.error('AI stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'AI generation failed. Please check your API key.' })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    );

  } catch (error) {
    console.error('Chat Streaming Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    // Messages are cascade-deleted by Prisma schema
    await prisma.chat.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const renameChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const updatedChat = await prisma.chat.update({
      where: { id },
      data: { title: title.trim() }
    });
    res.json(updatedChat);
  } catch (error) {
    console.error('Error renaming chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
