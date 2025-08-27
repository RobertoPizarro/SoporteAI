from pydantic import SecretStr

from langchain_openai import AzureChatOpenAI
from openai import AzureOpenAI
from backend.util.util_key import obtenerAPI

def obtenerModelo(temperature: float = 0.7) -> AzureChatOpenAI:
    return AzureChatOpenAI(
      api_version = "2024-12-01-preview",
      azure_endpoint = "https://AgenteAI-Instance.openai.azure.com/",
      api_key = SecretStr(obtenerAPI("CONF-OPENAI-API-KEY")),
      azure_deployment = "gpt-4o",
      temperature= temperature
    )