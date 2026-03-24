from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.services.embedding_service import get_embedding_model
import os
from dotenv import load_dotenv
from langchain_core.documents import Document

load_dotenv()

class QdrantWrapper:
    def __init__(self, client, collection_name, embeddings):
        self.client = client
        self.collection_name = collection_name
        self.embeddings = embeddings
        
    def similarity_search(self, query, k=8):
        # Embed the query
        query_vector = self.embeddings.embed_query(query)
        
        # Search using the new query_points API
        res = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=k
        )
        
        # Convert results to LangChain documents
        docs = []
        for point in res.points:
            payload = point.payload
            # Standard LangChain Qdrant payload keys are 'page_content' and 'metadata'
            content = payload.get("page_content", "")
            metadata = payload.get("metadata", {})
            docs.append(Document(page_content=content, metadata=metadata))
        return docs

def create_vector_store(chunks):
    embeddings = get_embedding_model()
    
    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    collection_name = os.getenv("QDRANT_COLLECTION_NAME", "rag_documents")

    client = QdrantClient(url=qdrant_url)
    
    # Ensure collection exists with correct config
    try:
        client.get_collection(collection_name)
        client.delete_collection(collection_name)
    except Exception:
        pass # Collection doesn't exist
        
    client.create_collection(
        collection_name=collection_name,
        vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
    )
    
    # Prepare points for upsert
    points = []
    for i, chunk in enumerate(chunks):
        # chunk is a LangChain Document
        vector = embeddings.embed_query(chunk.page_content)
        points.append(models.PointStruct(
            id=i,
            vector=vector,
            payload={
                "page_content": chunk.page_content,
                "metadata": chunk.metadata
            }
        ))
    
    # Upsert points
    client.upsert(
        collection_name=collection_name,
        points=points
    )
    
    # Return our wrapper matching the expected interface
    return QdrantWrapper(client, collection_name, embeddings)