## ################q######################################################################################
## @section Librerías
## #######################################################################################################

# Utilitario para crear una conversación de chat con el modelo
from langchain.chains import ConversationChain

# Utilitario para crear la memoria a corto plazo del modelo
from langchain.memory import ConversationBufferMemory

# Utilitario para crear un chat que incluya bases de conocimientos
from langchain.chains import ConversationalRetrievalChain

## #######################################################################################################
## @section Funciones
## #######################################################################################################


# Abre la sesión de chat con el modelo
def abrirSesionDeChat(llm=None, contexto: str = "", memoria=None):
    # Creamos la memoria a corto plazo
    # Agregamos la "personalidad" a nuestra IA
    if memoria is None:
        memoria = ConversationBufferMemory(memory_key="history", return_messages=True)
    memoria.chat_memory.add_ai_message(contexto)

    return ConversationChain(llm=llm, memory=memoria, verbose=False)


# Abre una sesión de chat y adjunta una base de conocimiento
def abrirSesionDeChatConBaseDeConocimiento(
    llm=None, basesDeConocimiento=None, contexto: str = "", memoria=None
):
    if memoria is None:
        memoria = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True
        )
    # Agregamos la "personalidad" a nuestra IA
    memoria.chat_memory.add_ai_message(contexto)

    return ConversationalRetrievalChain.from_llm(
        llm=llm, retriever=basesDeConocimiento, memory=memoria, verbose=False
    )


# Envía un mensaje a un chat
def enviarMensaje(chat: ConversationChain = None, mensaje: str = ""):
    # Enviamos el mensaje
    respuesta = chat.predict(input=mensaje)

    return respuesta


# Envía un mensaje a un chat que tiene una base de conocimiento asociada
def enviarMensajeEnChatConBaseDeConocimiento(
    chat: ConversationalRetrievalChain = None, mensaje: str = ""
):
    # Enviamos el mensaje
    respuesta = chat.invoke({"question": mensaje})

    # Extraemos el mensaje
    return respuesta.get("answer", respuesta)
