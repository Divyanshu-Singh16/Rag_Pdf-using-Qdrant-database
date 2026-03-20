from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_docs(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    return text_splitter.split_documents(documents)