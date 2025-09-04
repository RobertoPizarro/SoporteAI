# Cliente para Azure Cognitive Search
from langchain_community.retrievers import AzureCognitiveSearchRetriever
from azure.search.documents import SearchClient

# Credenciales Azure
from azure.core.credentials import AzureKeyCredential

# Helpers propios
from backend.util.util_key import obtenerAPI

nombre_servicio = "foundrysoporteia"
nombre_index = "indexuwu"

def obtenerBaseDeConocimientos() -> AzureCognitiveSearchRetriever:
    return AzureCognitiveSearchRetriever(
        service_name = nombre_servicio,
        api_key = obtenerAPI("CONF-AZURE-SEARCH-KEY"),
        index_name = nombre_index,
    )
    
def conectarBaseDeConocimientos():
    return SearchClient(
        f"https://{nombre_servicio}.search.windows.net",
        nombre_index,
        AzureKeyCredential(obtenerAPI("CONF-AZURE-SEARCH-KEY"))
    )