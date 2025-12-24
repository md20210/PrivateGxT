import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { privategxtApi, type ChatMessage } from '../services/api';
import MessageBubble from './MessageBubble';

interface ChatInterfaceProps {
  documentsCount: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ documentsCount }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('ollama');
  const [showExternalWarning, setShowExternalWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load chat history on mount
    loadHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const response = await privategxtApi.getChatHistory();
      setMessages(response.data.history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('privategxt_');
    setLoading(true);

    try {
      const response = await privategxtApi.chat(userMessage, provider);

      // Add to messages
      const chatMessage: ChatMessage = {
        id: response.data.id || Date.now().toString(),
        timestamp: new Date().toISOString(),
        message: userMessage,
        response: response.data.response,
        provider: response.data.provider,
        model: response.data.model,
        sources: response.data.sources || [],
        usage: response.data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };

      setMessages(prev => [...prev, chatMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      // Show error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        message: userMessage,
        response: `Error: ${error.response?.data?.detail || t('privategxt_chat_error')}`,
        provider: 'error',
        model: '',
        sources: [],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">
          {t('privategxt_chat_title')}
        </h2>

        {/* LLM Toggle Buttons */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setProvider('ollama');
              setShowExternalWarning(false);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              provider === 'ollama'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('privategxt_llm_local')}
          </button>
          <button
            onClick={() => {
              setProvider('grok');
              setShowExternalWarning(true);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              provider === 'grok'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('privategxt_llm_grok')}
          </button>
          <button
            onClick={() => {
              setProvider('anthropic');
              setShowExternalWarning(true);
            }}
            className={`px-4 py-2 rounded-md font-medium transition-all ${
              provider === 'anthropic'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('privategxt_llm_anthropic')}
          </button>
        </div>
      </div>

      {/* External API Warning */}
      {showExternalWarning && (
        <div className="mx-4 mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800 mb-1">
                {t('privategxt_warning_external_title')}
              </p>
              <p className="text-sm text-yellow-700">
                {t('privategxt_warning_external_message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <p className="text-lg mb-2">{t('privategxt_chat_empty')}</p>
            <p className="text-sm text-slate-400">
              {documentsCount > 0 ? t('privategxt_chat_ask_question') : t('privategxt_chat_upload_first')}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="flex-1 bg-slate-100 rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('privategxt_chat_input_placeholder')}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
