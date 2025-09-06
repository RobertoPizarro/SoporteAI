# Cliente para Azure Cognitive Search
from langchain_community.retrievers import AzureAISearchRetriever
from azure.search.documents import SearchClient

# Credenciales Azure
from azure.core.credentials import AzureKeyCredential

# Helpers propios
from backend.util.util_key import obtenerAPI

nombre_servicio = "support-bc"
nombre_index = "index_support"

def obtenerBaseDeConocimientos() -> AzureAISearchRetriever:
    return AzureAISearchRetriever(
        service_name = nombre_servicio,
        api_key = obtenerAPI("CONF-AZURE-SEARCH-KEY"),
        index_name = nombre_index,
        top_k = 5,
    )
    
def conectarBaseDeConocimientos():
    return SearchClient(
        f"https://{nombre_servicio}.search.windows.net",
        nombre_index,
        AzureKeyCredential(obtenerAPI("CONF-AZURE-SEARCH-KEY"))
    )