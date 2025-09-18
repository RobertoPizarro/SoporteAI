
from backend.util.util_llm import obtenerModelo
from backend.agents.AgenteOrquestador import AgenteOrquestador

# from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos

from backend.tools.buscarBaseConocimientos import BC_Tool

agente = AgenteBD(llm=obtenerModelo(), contexto= """
                                        Eres un agente de base de datos que puede realizar las acciones de las tools definidas
                                        un agente orquestador te dara un input y el contexto y debes elegir la mejor tool para la ocasion
                                       """)

#respuesta =agente.run("quiero que consultes la informacion del ticket 2")
#respuesta =agente.run("quiero que actualices el estado del ticket 2 a 'cancelado' sino puedes dime detalladamente que datos necesitarias ")
respuesta = agente.run("""Hola quiero que me crees un ticket con estos datos 'id_colaborador': '5a9760a5-3f9d-2141-7ca6-81362eef7cfd',
        'id_cliente_servicio': 'd50bf689-bfca-809b-5a7a-7c7bd8f42d1f',
        'id_analista': 'f36c6de9-5abd-7258-bf3f-19533740fd1b',
        'asunto': 'Problema de red',
        'estado': 'en atención',
        'nivel': 'medio',
        'tipo' : 'incidencia'""")

print(respuesta)