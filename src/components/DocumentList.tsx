import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Document } from '../services/api';

interface DocumentListProps {
  documents: Document[];
  onDelete: (docId: string) => void;
  onClearAll: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete, onClearAll }) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          {t('documents_title')} ({documents.length})
        </h2>
        {documents.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all"
          >
            {t('clear_all')}
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <svg className="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>{t('no_documents')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.doc_id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-medium text-slate-800">{doc.filename}</h3>
                </div>
                <div className="flex gap-4 text-sm text-slate-600 ml-7">
                  <span>{doc.chunks} {t('chunks')}</span>
                  <span>•</span>
                  <span>{formatDate(doc.uploaded_at)}</span>
                </div>
              </div>
              <button
                onClick={() => onDelete(doc.doc_id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title={t('delete_document')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
