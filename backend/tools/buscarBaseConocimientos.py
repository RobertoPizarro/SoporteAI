# Cliente para Azure Cognitive Search
from langchain_community.retrievers import AzureCognitiveSearchRetriever

# Utilitario para crear tool de base de conocimientos
from langchain.tools.retriever import create_retriever_tool

# Manejo de herramientas y agentes
from langchain_core.tools import Tool
from langchain.schema import Document
import json

# Helpers propios
from backend.util.util_base_de_conocimientos import obtenerBaseDeConocimientos

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


def BC_Tool() -> Tool:
    return create_retriever_tool(
        retriever=retriever,
        name="BaseDeConocimientos",
        description=(
            "Eres BC_Tool. Sólo puedes buscar y devolver fragmentos de la base de conocimiento (FAQ, guías, SOPs)."
            "No inventes contenido. Devuelve texto y metadatos de la fuente."
            "Si no encuentras resultados relevantes, responde vacío."
        ),
    )
