from langchain.schema import Document
from langchain.retrievers import AzureCognitiveSearchRetriever
from backend.util.util_base_de_conocimientos import obtenerBaseDeConocimientos
import json

retriever = obtenerBaseDeConocimientos()


def buscarBaseConocimientos(query: str = "", searchables: int = 3) -> str:
    try:
        docs: list[Document] = retriever.get_relevant_documents(query)

    except Exception as e:
        return json.dumps(
            {"status": "ERROR", "message": str(e), "query": query}, ensure_ascii=False
        )
    docs = docs[:searchables]

    lineas = []

    for doc in docs:
        texto = doc.page_content.replace("\n", " ").strip()
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
