from azure.core.credentials import AzureKeyCredential
from langchain.retrievers import AzureCognitiveSearchRetriever
from azure.search.documents import SearchClient
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