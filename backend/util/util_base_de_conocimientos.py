from langchain.retrievers import AzureCognitiveSearchRetriever
from backend.util.util_key import obtenerAPI

def obtenerBaseDeConocimientos(index: str = "indexuwu") -> AzureCognitiveSearchRetriever:
    return AzureCognitiveSearchRetriever(
        service_name=  "foundrysoporteia",
        api_key=obtenerAPI("CONF-AZURE-SEARCH-KEY"),
        index_name=index,
    )