import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    enabled: false,
    loading: false,
    error: null,
    lastResponse: null,
    lmStudioConnected: false,
    chatHistory: []
  }),
  
  actions: {
    async processIntent(intent) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/chat-intent`, intent);
        this.lastResponse = response.data;
        
        // Add to chat history
        this.chatHistory.push({
          type: 'user',
          content: JSON.stringify(intent),
          timestamp: new Date().toISOString()
        });
        
        this.chatHistory.push({
          type: 'bot',
          content: response.data.message || 'Request processed',
          data: response.data,
          timestamp: new Date().toISOString()
        });
        
        return response.data;
      } catch (error) {
        console.error('Error processing chatbot intent:', error);
        this.error = error.message || 'Failed to process chatbot intent';
        
        // Add error to chat history
        this.chatHistory.push({
          type: 'error',
          content: this.error,
          timestamp: new Date().toISOString()
        });
        
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async testLMStudioConnection() {
      this.loading = true;
      this.error = null;
      
      try {
        // In a real implementation, you'd test connection to LM Studio
        // For now, just simulate a successful connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.lmStudioConnected = true;
        return true;
      } catch (error) {
        console.error('Error connecting to LM Studio:', error);
        this.error = error.message || 'Failed to connect to LM Studio';
        this.lmStudioConnected = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    toggleChatbot(value) {
      if (value !== undefined) {
        this.enabled = value;
      } else {
        this.enabled = !this.enabled;
      }
    },
    
    clearChatHistory() {
      this.chatHistory = [];
    }
  }
});
