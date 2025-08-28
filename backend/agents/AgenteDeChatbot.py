from langchain.memory import ConversationBufferMemory

from backend.util.util_chat import (
    abrirSesionDeChat,
    abrirSesionDeChatConBaseDeConocimiento,
    enviarMensaje,
    enviarMensajeEnChatConBaseDeConocimiento,
)

# Esto va a morir en un corto plazo de tiempo :D

class AgenteDeChatbot:
    """
    Clase que maneja un agente de chatbot con o sin base de conocimientos. 
    Si se proporciona una base de conocimientos (retriever), utiliza ConversationalRetrievalChain (CRC).
    Si no, utiliza ConversationChain para chat puro.
    Permite reiniciar la memoria y enviar mensajes al agente.
    Atributos:
        llm: El modelo de lenguaje a utilizar.
        contexto: Contexto o "personalidad" inicial del chatbot.
        basesDeConocimiento: Un retriever para la base de conocimientos (opcional).
        memoria_chat: Memoria para chat sin base de conocimientos.
        chat_sin_kb: Instancia de ConversationChain para chat sin base de conocimientos.
        memoria_kb: Memoria para chat con base de conocimientos (si se proporciona).
        chat_con_kb: Instancia de ConversationalRetrievalChain para chat con base de conocimientos (si se proporciona).
    """
    def __init__(self, llm=None, contexto: str = "", basesDeConocimiento=None):
        self.llm = llm
        self.contexto = contexto
        self.basesDeConocimiento = basesDeConocimiento

        # Memoria para chat sin KB (ConversationChain)
        self.memoria_chat = ConversationBufferMemory(
            memory_key="history",
            return_messages=True,
        )
        self.chat_sin_kb = abrirSesionDeChat(
            llm=self.llm, contexto=self.contexto, memoria=self.memoria_chat
        )

        # Memoria y cadena para chat con KB (CRC), solo si hay retriever
        if self.basesDeConocimiento:
            self.memoria_kb = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
            )
            self.chat_con_kb = abrirSesionDeChatConBaseDeConocimiento(
                llm=self.llm,
                contexto=self.contexto,
                basesDeConocimiento=self.basesDeConocimiento,
                memoria=self.memoria_kb,
            )

    def reiniciar_memoria(self):
        """
        Limpia explícitamente la memoria de ambos historiales de chat.
        """
        if self.memoria_chat:
            self.memoria_chat.clear()
        if self.memoria_kb:
            self.memoria_kb.clear()

    def enviarMensaje(self, prompt: str = ""):
        """
        Si hay retriever disponible, usa la base de conocimiento (CRC).
        En otro caso, usa chat puro (ConversationChain).
        """
        if self.chat_con_kb is not None:
            print("--- AgenteDeChatbot: Usando la Base de Conocimientos ---")
            return enviarMensajeEnChatConBaseDeConocimiento(
                chat=self.chat_con_kb, mensaje=prompt
            )
        else:
            print("--- AgenteDeChatbot: Omitiendo la Base de Conocimientos ---")
            return enviarMensaje(chat=self.chat_sin_kb, mensaje=prompt)
