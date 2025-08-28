import os
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

# Función para obtener los archivos de una ruta
def obtenerArchivos(ruta=None):
    # Listamos el contenido de la carpeta
    os.listdir(ruta)

    # Acumulamos los archivos encontrados
    listaDeArchivos = []
    for elemento in os.listdir(ruta):
        rutaCompleta = os.path.join(ruta, elemento)  # type: ignore

        # Solo añadimos si es archivo (no directorio)
        if os.path.isfile(rutaCompleta):
            listaDeArchivos.append(rutaCompleta)

    return listaDeArchivos

def leerContenidoDeDocumento(rutaArchivo: str):
    servicio = DocumentAnalysisClient(
        key.require("CONF_AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT"),
        AzureKeyCredential(key.require("CONF_AZURE_DOCUMENT_INTELLIGENCE_KEY")),
    )
    with open(rutaArchivo, "rb") as archivo:
        poller = servicio.begin_analyze_document("prebuilt-read", archivo)
        resultado = poller.result()

    full_text = resultado.content or ""

    # Construimos una lista de párrafos con página (si la hay)
    parrafos = []
    for p in getattr(resultado, "paragraphs", []) or []:
        if not getattr(p, "spans", None):
            continue
        span = p.spans[0]
        texto = full_text[span.offset : span.offset + span.length].strip()
        if not texto:
            continue
        page = None
        if getattr(p, "bounding_regions", None):
            page = getattr(p.bounding_regions[0], "page_number", None)
        parrafos.append({"text": texto, "page": page})

    # Fallback: si no hay paragraphs, usa el viejo método por líneas
    if not parrafos:
        contenido = ""
        for pagina in resultado.pages:
            for linea in pagina.lines:
                contenido += linea.content + "\n"
        full_text = contenido
        # construye un solo “párrafo” con page=None para no romper el flujo
        parrafos = [{"text": full_text, "page": None}]

    return full_text, parrafos