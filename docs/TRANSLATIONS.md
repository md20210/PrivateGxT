# PrivateGxT Translations

## Translation Keys to Add to General Backend

Add these translations to `/backend/services/translation_service.py`:

```python
# PrivateGxT Translations
"privategxt_app_title": {
    "de": "PrivateGxT",
    "en": "PrivateGxT",
    "es": "PrivateGxT"
},
"privategxt_app_subtitle": {
    "de": "RAG-gestützte Dokumenten-Unterhaltung mit Multi-LLM-Gateway",
    "en": "RAG-powered Document Chat with Multi-LLM Gateway",
    "es": "Chat de Documentos con RAG y Gateway Multi-LLM"
},

# Upload Section
"upload_title": {
    "de": "Dokument hochladen",
    "en": "Upload Document",
    "es": "Subir Documento"
},
"upload_drag_drop": {
    "de": "Datei hierher ziehen oder klicken zum Auswählen",
    "en": "Drag & drop file here or click to select",
    "es": "Arrastra y suelta el archivo aquí o haz clic para seleccionar"
},
"upload_supported_formats": {
    "de": "PDF, DOCX, TXT (max. 10 MB)",
    "en": "PDF, DOCX, TXT (max 10 MB)",
    "es": "PDF, DOCX, TXT (máx. 10 MB)"
},
"uploading": {
    "de": "Wird hochgeladen...",
    "en": "Uploading...",
    "es": "Subiendo..."
},
"upload_error_type": {
    "de": "Ungültiger Dateityp. Nur PDF, DOCX und TXT erlaubt.",
    "en": "Invalid file type. Only PDF, DOCX, and TXT allowed.",
    "es": "Tipo de archivo no válido. Solo se permiten PDF, DOCX y TXT."
},
"upload_error_size": {
    "de": "Datei zu groß. Maximale Größe: 10 MB.",
    "en": "File too large. Maximum size: 10 MB.",
    "es": "Archivo demasiado grande. Tamaño máximo: 10 MB."
},
"upload_error_generic": {
    "de": "Fehler beim Hochladen. Bitte versuchen Sie es erneut.",
    "en": "Upload failed. Please try again.",
    "es": "Error al subir. Por favor, inténtalo de nuevo."
},

# Document List
"documents_title": {
    "de": "Dokumente",
    "en": "Documents",
    "es": "Documentos"
},
"no_documents": {
    "de": "Noch keine Dokumente hochgeladen",
    "en": "No documents uploaded yet",
    "es": "Aún no se han subido documentos"
},
"chunks": {
    "de": "Abschnitte",
    "en": "chunks",
    "es": "fragmentos"
},
"delete_document": {
    "de": "Dokument löschen",
    "en": "Delete document",
    "es": "Eliminar documento"
},
"clear_all": {
    "de": "Alle löschen",
    "en": "Clear All",
    "es": "Borrar Todo"
},
"confirm_delete": {
    "de": "Möchten Sie dieses Dokument wirklich löschen?",
    "en": "Are you sure you want to delete this document?",
    "es": "¿Estás seguro de que quieres eliminar este documento?"
},
"confirm_clear_all": {
    "de": "Möchten Sie wirklich alle Dokumente und den Chat-Verlauf löschen?",
    "en": "Are you sure you want to clear all documents and chat history?",
    "es": "¿Estás seguro de que quieres borrar todos los documentos y el historial de chat?"
},
"delete_error": {
    "de": "Fehler beim Löschen des Dokuments",
    "en": "Failed to delete document",
    "es": "Error al eliminar el documento"
},
"clear_error": {
    "de": "Fehler beim Löschen aller Daten",
    "en": "Failed to clear all data",
    "es": "Error al borrar todos los datos"
},

# Chat Interface
"chat_title": {
    "de": "Chat mit Ihren Dokumenten",
    "en": "Chat with Your Documents",
    "es": "Chatea con Tus Documentos"
},
"chat_empty": {
    "de": "Noch keine Nachrichten",
    "en": "No messages yet",
    "es": "Aún no hay mensajes"
},
"chat_ask_question": {
    "de": "Stellen Sie eine Frage zu Ihren Dokumenten",
    "en": "Ask a question about your documents",
    "es": "Haz una pregunta sobre tus documentos"
},
"chat_upload_first": {
    "de": "Laden Sie zuerst ein Dokument hoch",
    "en": "Upload a document first",
    "es": "Sube primero un documento"
},
"chat_input_placeholder": {
    "de": "Stellen Sie eine Frage...",
    "en": "Ask a question...",
    "es": "Haz una pregunta..."
},
"chat_error": {
    "de": "Fehler beim Senden der Nachricht",
    "en": "Failed to send message",
    "es": "Error al enviar el mensaje"
},

# Sources
"sources": {
    "de": "Quellen",
    "en": "Sources",
    "es": "Fuentes"
},
"chunk": {
    "de": "Abschnitt",
    "en": "Chunk",
    "es": "Fragmento"
},

# Stats
"stats_documents": {
    "de": "Dokumente",
    "en": "Documents",
    "es": "Documentos"
},
"stats_chunks": {
    "de": "Abschnitte",
    "en": "Chunks",
    "es": "Fragmentos"
},
"stats_messages": {
    "de": "Nachrichten",
    "en": "Messages",
    "es": "Mensajes"
},

# Footer
"footer_powered_by": {
    "de": "Powered by",
    "en": "Powered by",
    "es": "Desarrollado con"
},
```

## Implementation Instructions

1. Open `/mnt/e/CodelocalLLM/GeneralBackend/backend/services/translation_service.py`
2. Locate the `UI_TRANSLATIONS` dictionary
3. Add all PrivateGxT translation keys from above
4. Restart General Backend to load new translations
5. PrivateGxT frontend will automatically fetch them

## Translation Coverage

- **Total Keys**: 30
- **Languages**: German (DE), English (EN), Spanish (ES)
- **Categories**:
  - App Header (2 keys)
  - Upload Section (7 keys)
  - Document List (9 keys)
  - Chat Interface (6 keys)
  - Sources (2 keys)
  - Stats (3 keys)
  - Footer (1 key)

## Testing

```bash
# Test translation endpoint
curl https://general-backend-production-a734.up.railway.app/translations/de

# Should return all PrivateGxT keys in German
```

## Notes

- All translations use consistent naming: `privategxt_*` prefix for app-level keys
- Generic keys (upload_*, chat_*, etc.) can be reused by other projects
- Translations are cached in frontend localStorage for performance
