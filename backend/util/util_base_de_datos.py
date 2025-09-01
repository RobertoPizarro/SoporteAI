"""Utilidades de conexión a base de datos para memoria de LangGraph.

Evita fallar si psycopg/libpq no están instalados; usa memoria en RAM por defecto.
"""
from backend.util.util_key import obtenerAPI
from langgraph.checkpoint.postgres import PostgresSaver  # type: ignore


def obtenerConexionBaseDeDatos():
    db_url = obtenerAPI("CONF-DATABASE-URL")
    if not db_url or not PostgresSaver:
        print("PostgresSaver no disponible; usando memoria en RAM.")
        return None
    try:
        conn = PostgresSaver.from_conn_string(db_url)  # type: ignore
        conn.setup()  # type: ignore
        print("Conexión a la base de datos establecida.")
        return conn
    except Exception as e:
        print(f"No se pudo conectar a Postgres: {e}. Usando memoria en RAM.")
        return None