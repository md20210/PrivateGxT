import axios from 'axios';

const API_BASE_URL = 'https://general-backend-production-a734.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Document {
  doc_id: string;
  filename: string;
  chunks: number;
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  timestamp: string;
  message: string;
  response: string;
  provider: string;
  model: string;
  sources: Array<{
    filename: string;
    chunk_index: number;
    doc_id: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface Stats {
  documents: number;
  chunks: number;
  messages: number;
}

// PrivateGxT API
export const privategxtApi = {
  // Document management
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/privategxt/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getDocuments: async () => {
    return api.get<{ success: boolean; documents: Document[]; count: number }>('/privategxt/documents');
  },

  deleteDocument: async (docId: string) => {
    return api.delete(`/privategxt/documents/${docId}`);
  },

  clearAll: async () => {
    return api.delete('/privategxt/clear');
  },

  // Chat
  chat: async (message: string, provider: string = 'anthropic', model?: string, temperature: number = 0.7) => {
    return api.post('/privategxt/chat', {
      message,
      provider,
      model,
      temperature,
    });
  },

  getChatHistory: async () => {
    return api.get<{ success: boolean; history: ChatMessage[]; count: number }>('/privategxt/chat/history');
  },

  // Stats
  getStats: async () => {
    return api.get<{ success: boolean; stats: Stats }>('/privategxt/stats');
  },
};

// Translations API
export const translationsApi = {
  getTranslations: async (language: string) => {
    return api.get(`/translations/${language}?t=${Date.now()}`);
  },
};

export default api;
