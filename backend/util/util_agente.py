from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_openai import AzureChatOpenAI

## #######################################################################################################
## @section Funciones
## #######################################################################################################

def crearAgente(
    llm: AzureChatOpenAI, tools: list | None = None, contexto: str = "", memoria=None
):
    if tools is None:
        tools = []
    if memoria is None:
        memoria = InMemorySaver()
    agente = create_react_agent(
        model=llm, tools=tools, checkpointer=memoria, prompt=contexto
    )
    return agente


def ejecutar(agente, consulta: str = "", config=None):
    try:
        respuesta = agente.invoke(
            {"messages": [{"role": "user", "content": consulta}]}, config=config
        )
        return respuesta
    except Exception as e:
        print("Error en la ejecución del agente: ", e)
        return None
