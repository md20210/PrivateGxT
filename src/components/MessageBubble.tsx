import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { ChatMessage } from '../services/api';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { t } = useLanguage();
  const [showSources, setShowSources] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3 message-enter">
      {/* User Message */}
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="bg-blue-600 text-white rounded-lg p-4 shadow-md">
            <p className="whitespace-pre-wrap">{message.message}</p>
            <p className="text-xs text-blue-100 mt-2">{formatTime(message.timestamp)}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            AI
          </div>
          <div className="flex-1">
            <div className={`rounded-lg p-4 shadow-md ${message.provider === 'error' ? 'bg-red-50 border border-red-200' : 'bg-slate-100'}`}>
              <p className={`whitespace-pre-wrap ${message.provider === 'error' ? 'text-red-700' : 'text-slate-800'}`}>
                {message.response}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium">{message.model}</span>
                  {message.usage && (
                    <>
                      <span>•</span>
                      <span>{message.usage.total_tokens} tokens</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-400">{formatTime(message.timestamp)}</p>
              </div>

              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <svg className={`w-4 h-4 transition-transform ${showSources ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t('privategxt_sources')} ({message.sources.length})
                  </button>

                  {showSources && (
                    <div className="mt-2 space-y-2">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm bg-white rounded p-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-slate-700">{source.filename}</p>
                            <p className="text-xs text-slate-500">
                              {t('privategxt_chunk')} {source.chunk_index + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
