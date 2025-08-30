from langchain.schema import Document
from langchain.retrievers import AzureCognitiveSearchRetriever
from backend.util.util_base_de_conocimientos import obtenerBaseDeConocimientos
import json

retriever = obtenerBaseDeConocimientos()

def buscarBaseConocimientos(query: str = "", searchables: int = 3) -> str:
    """
    Realiza una búsqueda en la base de conocimientos utilizando Azure Cognitive Search.
    Args:
        query (str, optional): Consulta de búsqueda. Defaults to "".
        searchables (int, optional): Número máximo de resultados a devolver. Defaults to 3.

    Returns:
        str: Resultados de la búsqueda en formato JSON.
    """
    try:
        # Realizar la búsqueda en la base de conocimientos
        docs: list[Document] = retriever.get_relevant_documents(query)

    except Exception as e:
        return json.dumps(
            {"status": "ERROR", "message": str(e), "query": query}, ensure_ascii=False
        )
    
    # Limitar el número de resultados a 'searchables'
    docs = docs[:searchables]

    lineas = []

    for doc in docs:
        
        # Limpiar y preparar el texto para mostrar
        texto = doc.page_content.replace("\n", " ").strip()
        
        # Agregar el documento a la lista de resultados
        lineas.append(
            {
                "id": doc.metadata.get("id"),
                "parent_id": doc.metadata.get("parent_id"),
                "title": doc.metadata.get("title"),
                "updated_at": doc.metadata.get("updated_at"),
                "chunk_index": doc.metadata.get("chunk_index"),
                "page": doc.metadata.get("page"),
                "tags": doc.metadata.get("tags") or [],
                "texto": texto[:700] + ("..." if len(texto) > 700 else ""),
            }
        )
    if not lineas:
        return json.dumps(
            {"status": "SIN_RESULTADOS", "query": query}, ensure_ascii=False
        )

    return json.dumps(
        {"status": "OK", "query": query, "resultados": lineas}, ensure_ascii=False
    )
