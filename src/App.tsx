import { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { privategxtApi, type Document, type Stats } from './services/api';
import LanguageToggle from './components/LanguageToggle';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';

function App() {
  const { t, loading: translationsLoading } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [docsResponse, statsResponse] = await Promise.all([
        privategxtApi.getDocuments(),
        privategxtApi.getStats()
      ]);

      setDocuments(docsResponse.data.documents);
      setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleUploadSuccess = () => {
    loadData();
  };

  const handleDelete = async (docId: string) => {
    if (!confirm(t('confirm_delete'))) return;

    try {
      await privategxtApi.deleteDocument(docId);
      loadData();
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert(t('delete_error'));
    }
  };

  const handleClearAll = async () => {
    if (!confirm(t('confirm_clear_all'))) return;

    try {
      await privategxtApi.clearAll();
      loadData();
    } catch (error) {
      console.error('Failed to clear all:', error);
      alert(t('clear_error'));
    }
  };

  // Show loading screen until translations are loaded
  if (translationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                {t('app_title')}
              </h1>
              <p className="text-lg text-slate-600">
                {t('app_subtitle')}
              </p>
            </div>
            <LanguageToggle />
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.documents}</p>
                    <p className="text-sm text-slate-600">{t('stats_documents')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.chunks}</p>
                    <p className="text-sm text-slate-600">{t('stats_chunks')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stats.messages}</p>
                    <p className="text-sm text-slate-600">{t('stats_messages')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Document Management */}
          <div className="space-y-6">
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
            <DocumentList
              documents={documents}
              onDelete={handleDelete}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-2">
            <ChatInterface documentsCount={documents.length} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>
            {t('footer_powered_by')}
            <a href="https://www.dabrock.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium mx-1">
              General Backend
            </a>
            • RAG mit ChromaDB • Multi-LLM Gateway
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
