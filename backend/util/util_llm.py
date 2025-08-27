from pydantic import SecretStr

from langchain_openai import AzureChatOpenAI
from openai import AzureOpenAI
from backend.util.util_key import obtenerAPI
def obtenerModelo(temperature: float = 0.7) :
    return AzureChatOpenAI(
      api_version = key.require("CONF_API_VERSION"),
      azure_endpoint = key.require("CONF_AZURE_ENDPOINT"),
      api_key = SecretStr(obtenerAPI("CONF-OPENAI-API-KEY")),
      azure_deployment = key.require("CONF_AZURE_DEPLOYMENT"),
      temperature= temperature
    )