from fastapi import APIRouter, UploadFile, File, Form
import os

from app.services.pdf_service import load_pdf
from app.utils.chunking import split_docs
from app.services.vector_service import create_vector_store
from app.services.rag_service import get_answer

# FIRST define router
router = APIRouter()

UPLOAD_DIR = "data/pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

vector_store = None


#  Upload API
@router.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    global vector_store

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    documents = load_pdf(file_path)
    chunks = split_docs(documents)

    vector_store = create_vector_store(chunks)

    return {"message": "PDF processed successfully"}


#  Ask API
@router.post("/ask")
def ask_question(question: str = Form(...)):
    global vector_store

    if vector_store is None:
        return {"error": "No PDF uploaded yet"}

    # Increase k to retrieve more context ensuring nothing is missed
    docs = vector_store.similarity_search(question, k=15)

    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
    You are an expert document assistant. Using the context below, answer the user's question.

    FORMATTING RULES (follow strictly):
    1. If the answer contains structured data such as bit positions, field definitions, register maps, specifications, or any data with columns (e.g. Field, Bit Position, Description) — ALWAYS present it as a proper Markdown table with | pipe | syntax.
    2. Use bold (**text**) for key terms and section headers when not in a table.
    3. Use bullet points for lists.
    4. NEVER use asterisks (*) as plain text — only use them for bold (**) or italics (*).
    5. Do NOT summarize, compress, or omit any information. Include ALL rows, ALL fields, and ALL descriptions exactly as they appear in the source.
    6. After a table, add a short plain-English summary of the most important points.

    Context:
    {context}

    Question: {question}
    """

    try:
        answer = get_answer(prompt)
        return {"answer": answer}
    except Exception as e:
        return {"error": f"API Provider Error: {str(e)}"}