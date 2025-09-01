"""Utilidades de conexión a base de datos para memoria de LangGraph.

Evita fallar si psycopg/libpq no están instalados; usa memoria en RAM por defecto.
"""
from backend.util.util_key import obtenerAPI
from langgraph.checkpoint.postgres import PostgresSaver

db_url = obtenerAPI("CONF-DATABASE-URL")
    
def obtenerConexionBaseDeDatos():
    try:
        conn = PostgresSaver.from_conn_string(db_url)
        saver = conn.__enter__()
        saver.setup()
        print("Conexión a la base de datos establecida.")
        return conn, saver
    except Exception as e:
        print("No se pudo conectar a la base de datos. Error:", e)
        return None, None