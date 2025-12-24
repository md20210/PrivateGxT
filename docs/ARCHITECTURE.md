# PrivateGxT - Architecture Documentation

## Overview

PrivateGxT is a **RAG (Retrieval-Augmented Generation) showcase** that demonstrates document-based chat capabilities. Users can upload documents (PDF, DOCX, TXT), which are processed and vectorized for intelligent question-answering.

**Key Design**: Single test user showcase (like CV Matcher) - no complex user management.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PrivateGxT Frontend                      │
│                  (React + TypeScript)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Document   │  │     Chat     │  │  Language    │     │
│  │   Upload     │  │  Interface   │  │   Toggle     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTPS (REST API)
                            │
┌─────────────────────────────────────────────────────────────┐
│                 General Backend (FastAPI)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PrivateGxT API (/privategxt/*)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         PrivateGxT Service (privategxt_service)      │  │
│  │  • Document parsing (PDF, DOCX, TXT)                 │  │
│  │  • Text chunking with overlap                        │  │
│  │  • ChromaDB integration                              │  │
│  │  • RAG query processing                              │  │
│  │  • Chat history management                           │  │
│  └──────────────────────────────────────────────────────┘  │
│              │                            │                 │
│  ┌───────────────────┐      ┌───────────────────────┐     │
│  │   LLM Gateway     │      │     ChromaDB          │     │
│  │ • Anthropic       │      │  (Vector Database)    │     │
│  │ • Grok            │      │  • Embeddings         │     │
│  │ • Ollama (local)  │      │  • Similarity Search  │     │
│  └───────────────────┘      └───────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### **Frontend**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling (light theme matching CV Matcher)
- **Axios** - HTTP client

### **Backend** (General Backend)
- **FastAPI** - Python web framework
- **ChromaDB** - Vector database for embeddings
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction
- **LLM Gateway** - Multi-provider LLM integration

### **LLM Providers**
- **Anthropic Claude** - Claude 3.5 Sonnet (default)
- **Grok** - X.AI's frontier model
- **Ollama** - Local models (llama3.2, nomic-embed-text)

---

## Data Flow

### **Document Upload Flow**
```
1. User uploads PDF/DOCX/TXT → Frontend
2. Frontend sends file → POST /privategxt/upload
3. Backend extracts text (PyPDF2/python-docx)
4. Text chunked into 500-char segments (50-char overlap)
5. Chunks stored in ChromaDB with embeddings
6. Return document metadata → Frontend
```

### **Chat/RAG Flow**
```
1. User sends message → Frontend
2. Frontend sends message → POST /privategxt/chat
3. Backend queries ChromaDB for relevant chunks (similarity search)
4. Top 5 chunks retrieved as context
5. Context + message → LLM Gateway
6. LLM generates response with sources
7. Response + sources → Frontend
8. Display with source attribution
```

---

## API Endpoints

### **Document Management**

#### `POST /privategxt/upload`
Upload document for processing.

**Request**: `multipart/form-data`
- `file`: PDF, DOCX, or TXT file

**Response**:
```json
{
  "success": true,
  "document": {
    "doc_id": "uuid",
    "filename": "document.pdf",
    "chunks": 15,
    "characters": 7500,
    "uploaded_at": "2025-12-24T10:00:00"
  }
}
```

#### `GET /privategxt/documents`
List all uploaded documents.

**Response**:
```json
{
  "success": true,
  "documents": [
    {
      "doc_id": "uuid",
      "filename": "document.pdf",
      "chunks": 15,
      "uploaded_at": "2025-12-24T10:00:00"
    }
  ],
  "count": 1
}
```

#### `DELETE /privategxt/documents/{doc_id}`
Delete specific document.

**Response**:
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

#### `DELETE /privategxt/clear`
Clear all documents and chat history.

**Response**:
```json
{
  "success": true,
  "documents_cleared": 3,
  "chunks_cleared": 45,
  "messages_cleared": 12
}
```

### **Chat**

#### `POST /privategxt/chat`
Chat with RAG context.

**Request**:
```json
{
  "message": "What are the main findings?",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "temperature": 0.7
}
```

**Response**:
```json
{
  "success": true,
  "response": "Based on the documents...",
  "sources": [
    {
      "filename": "document.pdf",
      "chunk_index": 3,
      "doc_id": "uuid"
    }
  ],
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "prompt_tokens": 1200,
    "completion_tokens": 300,
    "total_tokens": 1500
  }
}
```

#### `GET /privategxt/chat/history`
Get chat history.

**Response**:
```json
{
  "success": true,
  "history": [
    {
      "id": "uuid",
      "timestamp": "2025-12-24T10:05:00",
      "message": "What are the main findings?",
      "response": "Based on the documents...",
      "provider": "anthropic",
      "model": "claude-3-5-sonnet-20241022",
      "sources": [...],
      "usage": {...}
    }
  ],
  "count": 1
}
```

### **Statistics**

#### `GET /privategxt/stats`
Get statistics.

**Response**:
```json
{
  "success": true,
  "stats": {
    "documents": 3,
    "chunks": 45,
    "messages": 12
  }
}
```

---

## RAG Implementation Details

### **Text Chunking**
- **Chunk Size**: 500 characters
- **Overlap**: 50 characters
- **Strategy**: Break at sentence boundaries (`.` or `\n`)
- **Fallback**: Hard break if no boundary found

### **Embedding & Storage**
- **Embeddings**: Auto-generated by ChromaDB
- **Model**: `nomic-embed-text` (via Ollama)
- **Metadata per Chunk**:
  ```python
  {
    "doc_id": "uuid",
    "filename": "document.pdf",
    "chunk_index": 0,
    "total_chunks": 15,
    "hash": "md5_hash",
    "uploaded_at": "ISO timestamp"
  }
  ```

### **Retrieval**
- **Query**: User message embedded using same model
- **Results**: Top 5 most similar chunks
- **Context**: Chunks formatted with source attribution

### **Prompt Engineering**
```python
prompt = f"""You are a helpful AI assistant. Answer the user's question based on the provided document context.

Context from uploaded documents:
[Source 1: document.pdf - Chunk 3]
{chunk_text}

---

[Source 2: document.pdf - Chunk 7]
{chunk_text}

User Question: {message}

Instructions:
- Answer based on the context provided
- If the answer is not in the context, say so clearly
- Be concise and precise
- Reference specific sources when applicable"""
```

---

## Frontend Components

### **1. DocumentUpload.tsx**
- Drag & drop interface
- File validation (PDF, DOCX, TXT only)
- Upload progress
- Error handling

### **2. DocumentList.tsx**
- Display uploaded documents
- Show chunk count and upload time
- Delete individual documents
- Clear all button

### **3. ChatInterface.tsx**
- Message input with auto-focus
- Send button + Enter key support
- Message history display
- Loading states

### **4. MessageBubble.tsx**
- User messages (right-aligned, blue)
- AI responses (left-aligned, gray)
- Source attribution
- Timestamp

### **5. SourceReferences.tsx**
- Expandable source list
- Click to highlight relevant chunk
- Document name + chunk index

### **6. LanguageToggle.tsx**
- DE / EN / ES switcher
- Persists to localStorage
- Triggers translation reload

---

## Configuration

### **Backend** (`/backend/config.py`)
```python
OLLAMA_BASE_URL = "http://localhost:11434"
ANTHROPIC_API_KEY = "sk-ant-..."
GROK_API_KEY = "xai-..."
CHROMA_DATA_PATH = "./chroma_data/privategxt"
```

### **Frontend** (`src/services/api.ts`)
```typescript
const API_BASE_URL = "https://general-backend-production-a734.up.railway.app";
const PRIVATEGXT_PREFIX = "/privategxt";
```

---

## Deployment

### **Backend**
1. Backend already deployed on Railway (General Backend)
2. New endpoints automatically available
3. ChromaDB data persists in Railway volume

### **Frontend**
```bash
# Build
npm run build

# Upload to Strato
cd dist
lftp -c "
  set sftp:auto-confirm yes;
  open -u su403214,'deutz15!2000' sftp://5018735097.ssh.w2.strato.hosting;
  cd dabrock-info/privategxt;
  mirror -R .
"
```

**Live URL**: `https://www.dabrock.info/privategxt/`

---

## Security Considerations

### **GDPR Compliance**
- All data processing happens in General Backend (EU deployment possible)
- No user tracking or analytics
- Documents can be deleted anytime
- Chat history in-memory only (not persisted)

### **File Upload Security**
- File size limit: 10 MB
- Allowed types: PDF, DOCX, TXT only
- Virus scanning recommended for production
- Deduplication via MD5 hash

### **API Security**
- CORS configured for `dabrock.info`
- Rate limiting recommended for production
- No authentication (showcase only)

---

## Limitations (Showcase Version)

1. **Single Session**: All users share same documents and chat
2. **No Persistence**: Chat history in-memory only
3. **No Auth**: Anyone can upload/delete documents
4. **No Cleanup**: Manual clear required

**Production Recommendations**:
- Add user authentication (magic links)
- Separate collections per user
- Persistent chat history (PostgreSQL)
- Auto-cleanup after 24 hours idle
- File size limits and scanning

---

## Testing

### **Backend Tests**
```bash
# Test document upload
curl -X POST http://localhost:8000/privategxt/upload \
  -F "file=@test.pdf"

# Test chat
curl -X POST http://localhost:8000/privategxt/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this about?", "provider": "anthropic"}'

# Get documents
curl http://localhost:8000/privategxt/documents

# Get stats
curl http://localhost:8000/privategxt/stats
```

### **Frontend Tests**
1. Upload PDF → Verify chunks created
2. Ask question → Verify RAG context used
3. Check sources → Verify correct attribution
4. Delete document → Verify removed
5. Language switch → Verify translations

---

## Performance

### **Expected Metrics**
- **Document Upload**: 2-5s for 10-page PDF
- **Chat Response**: 1-3s with Anthropic
- **Chunk Retrieval**: <100ms
- **Concurrent Users**: 10-20 (showcase)

### **Optimization**
- ChromaDB uses HNSW index for fast similarity search
- Embeddings cached in ChromaDB
- Chat history limited to last 50 messages
- Auto-cleanup on clear

---

## Troubleshooting

### **Upload Fails**
- Check file format (PDF, DOCX, TXT only)
- Verify file not corrupted
- Check backend logs for parsing errors

### **No RAG Context**
- Ensure documents uploaded successfully
- Check ChromaDB collection has chunks
- Verify embeddings generated

### **LLM Errors**
- Check API keys configured
- Verify Ollama running (for local models)
- Check network connectivity

---

## Future Enhancements

### **Phase 2 (Production)**
- Multi-user support with magic links
- Persistent chat history
- Document folders/tags
- Advanced search filters
- PDF highlighting (show exact match location)

### **Phase 3 (Advanced)**
- Image extraction from PDFs
- Table parsing
- Multi-document synthesis
- Export chat history
- API key management UI

---

## References

- [ChromaDB Documentation](https://docs.trychroma.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Anthropic API](https://docs.anthropic.com/)
- [General Backend Architecture](../GeneralBackend/docs/ARCHITECTURE.md)

---

**Last Updated**: 2025-12-24
**Version**: 1.0.0
**Author**: Michael Dabrock
