# Utilitario para crear y ejecutar agentes
from langgraph.prebuilt import create_react_agent
# Utilitario para el modelo de lenguaje
from langchain_openai import AzureChatOpenAI
# Manejo de memoria del agente
from langgraph.checkpoint.memory import InMemorySaver

# Para extraer el contenido de la respuesta 
from langchain.schema import AIMessage

def _extraerContenido(respuesta):
    if isinstance(respuesta, dict) and "output" in respuesta:
        return respuesta["AIMessage"]
    return respuesta

def crearAgente(
    llm: AzureChatOpenAI, tools: list | None = None, contexto: str = "", memoria=None
):
    if tools is None:
        tools = []
    if memoria is None:
        memoria = InMemorySaver()
    agente = create_react_agent(
        model=llm, tools=tools, checkpointer=memoria, prompt=contexto,
    )
    return agente



def ejecutar(agente, consulta: str = "", config=None, verbose: bool = True):
    try:
        respuesta = agente.invoke({"messages": [{"role": "user", "content": consulta}]}, config=config)
        for message in respuesta["messages"]:
            print(f'{message.pretty_print()}')
            return respuesta["messages"][-1].content
    except Exception as e:
        print("Error en la ejecución del agente: ", e)
        return {'type': 'error', 'message': f'Error inesperado en la ejecución del agente: {e}'}
