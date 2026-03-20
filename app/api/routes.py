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

    docs = vector_store.similarity_search(question)

    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
    Answer based on the context below:

    {context}

    Question: {question}
    """

    try:
        answer = get_answer(prompt)
        return {"answer": answer}
    except Exception as e:
        return {"error": f"API Provider Error: {str(e)}"}