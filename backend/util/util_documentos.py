from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from backend.util.util_key import obtenerAPI

def conectarDocumentIntelligence():
    return DocumentAnalysisClient(
        endpoint="https://lector-documentos-bda-fabri.cognitiveservices.azure.com/",
        credential=AzureKeyCredential(obtenerAPI("CONF-AZURE-FORM-RECOGNIZER-KEY")),
    )