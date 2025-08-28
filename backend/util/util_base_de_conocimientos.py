from azure.core.credentials import AzureKeyCredential
from langchain.retrievers import AzureCognitiveSearchRetriever
from azure.search.documents import SearchClient
from backend.util.util_key import obtenerAPI

nombre_servicio = "foundrysoporteia"

def obtenerBaseDeConocimientos(index: str = "indexuwu") -> AzureCognitiveSearchRetriever:
    return AzureCognitiveSearchRetriever(
        service_name=  nombre_servicio,
        api_key=obtenerAPI("CONF-AZURE-SEARCH-KEY"),
        index_name=index,
    )
    
def conectarBaseDeConocimientos():
    return SearchClient(
        f"https://{nombre_servicio}.search.windows.net",
        "indexuwu",
        AzureKeyCredential(obtenerAPI("CONF-AZURE-SEARCH-KEY"))
    )