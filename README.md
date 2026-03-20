# RAG PDF API Project

A FastAPI-based Retrieval-Augmented Generation (RAG) system that allows you to upload PDF documents and ask questions about their content using Qdrant for vector storage and Groq for fast LLM inference.

## Features
- **PDF Upload and Processing:** Extracts text from uploaded PDF documents.
- **Smart Chunking:** Splits documents into overlapping chunks using `RecursiveCharacterTextSplitter` to preserve context.
- **Vector Database:** Uses **Qdrant** (running in Docker) and `sentence-transformers/all-MiniLM-L6-v2` for persistent vector storage.
- **Generative AI Responses:** Leverages **Groq** (`llama-3.3-70b-versatile`) to generate highly accurate and blazingly fast answers based on the retrieved context.

## Technology Stack
- **Framework:** FastAPI
- **Vector Store:** Qdrant (Docker)
- **Embeddings:** HuggingFace Sentence Transformers
- **LLM Provider:** Groq
- **Document Loading & Chunking:** LangChain

---

## Getting Started

### 1. Setup Environment
**Activate your Virtual Environment:**
```bash
source venv/bin/activate
```

**Install Dependencies:**
```bash
pip install fastapi uvicorn python-multipart pypdf langchain langchain-community langchain-huggingface sentence-transformers qdrant-client openai python-dotenv
```

**Configure `.env`:**
Ensure your `.env` file contains your API keys and Qdrant configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=rag_documents
```

---

## Running the Application

### **How to START everything:**
1.  **Start Qdrant (Docker)**:
    ```bash
    docker start elated_ritchie
    ```
2.  **Start the FastAPI Server**:
    ```bash
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
3.  **Open in Browser**:
    Go to **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to interact with the API via Swagger UI.

### **How to STOP everything:**
1.  **Stop the FastAPI Server**:
    Press **`CTRL + C`** in the terminal where the server is running.
2.  **Stop Qdrant (Docker)**:
    ```bash
    docker stop elated_ritchie
    ```

---

## API Usage
You can test the system using the interactive Swagger UI at `/docs`.

1. **`POST /upload`**: Upload a PDF file to index it into Qdrant.
2. **`POST /ask`**: Provide a `question` (as form data) to get an answer based on the uploaded PDF.

## Project Structure
```text
rag_pdf_project/
├── .env                          # Environment variables
├── app/
│   ├── main.py                   # FastAPI entrypoint
│   ├── api/
│   │   └── routes.py             # API endpoints (/upload, /ask)
│   ├── services/
│   │   ├── embedding_service.py  # HuggingFace Embedding configuration
│   │   ├── pdf_service.py        # PDF extraction logic
│   │   ├── rag_service.py        # Groq (LLM) generation logic
│   │   └── vector_service.py     # Qdrant vector store management
│   └── utils/
│       └── chunking.py           # Document text splitting logic
└── README.md                     # Documentation
```
