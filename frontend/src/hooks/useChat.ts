import { useState, useCallback, useRef } from 'react';
import type { Message, ChatState } from '../types/chat';
import { AIService } from '../services/ai/AIService';
import { useAppStore } from '../store/useAppStore';

export const useChat = () => {
  const { selectedVenue } = useAppStore();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      { 
        id: '1', 
        role: 'assistant', 
        content: 'Welcome to FanFlow AI. I can assist you with stadium navigation, amenities, and event information. How can I help you today?',
        timestamp: Date.now()
      }
    ],
    isLoading: false,
    error: null,
  });
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || chatState.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      if (!navigator.onLine) {
        throw new Error('No Internet connection. Please check your network.');
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutRef.current = setTimeout(() => reject(new Error('Request timeout')), 15000);
      });
      
      const aiResponsePromise = AIService.generateResponse(chatState.messages, userMessage.content, selectedVenue);
      
      const responseText = await Promise.race([aiResponsePromise, timeoutPromise]);
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      let errorMessage = 'System error: Unable to connect to the assistant service.';
      
      if (error.message) {
        if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
        } else {
            errorMessage = error.message;
        }
      }
      
      setChatState(prev => ({
        ...prev,
        error: errorMessage,
        messages: [...prev.messages, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: Date.now()
        }],
        isLoading: false
      }));
    }
  }, [chatState.messages, chatState.isLoading, selectedVenue]);

  const resetLoading = useCallback(() => {
    setChatState(prev => ({ ...prev, isLoading: false }));
  }, []);

  return {
    messages: chatState.messages,
    isLoading: chatState.isLoading,
    error: chatState.error,
    sendMessage,
    resetLoading
  };
};
