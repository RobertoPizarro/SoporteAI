import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Cargar .env de la raíz del proyecto
load_dotenv()

USER = os.getenv("PGUSER")
PASSWORD = os.getenv("PGPASSWORD")
HOST = os.getenv("PGHOST")
PORT = os.getenv("PGPORT", "5432")
DB_NAME = os.getenv("PGDATABASE")

DATABASE_URL = (
    f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/analyticsdb?sslmode=require"
)
#print(DATABASE_URL)
engine = create_engine(DATABASE_URL, echo=True)

def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            print("✅ Conexión exitosa a PostgreSQL")
            print("Versión:", result.fetchone()[0])
    except SQLAlchemyError as e:
        print("❌ Error al conectar a la base de datos:", str(e))
        
def tables_in_database():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_schema, table_name
                FROM information_schema.tables
                WHERE table_type = 'BASE TABLE'
                AND table_schema NOT IN ('pg_catalog', 'information_schema')
                ORDER BY table_schema, table_name;
            """))

            rows = result.fetchall()  # ⚡ importante en SQLAlchemy 2.x
            if not rows:
                print("No se encontraron tablas.")
            else:
                for i, row in enumerate(rows, 1):
                    print(f"Tabla {i}: {row}")
    except SQLAlchemyError as e:
        print("❌ Error al invocar las tablas de la BD:", str(e))
        
def revisar_tipos_PK():
    try:
        with engine.connect() as conn :
            result = conn.execute(text(
                        """
                        SELECT
                        kcu.table_name,
                        kcu.column_name,
                        c.data_type
                        FROM information_schema.table_constraints tc
                        JOIN information_schema.key_column_usage kcu
                            ON tc.constraint_name = kcu.constraint_name
                            AND tc.table_schema = kcu.table_schema
                        JOIN information_schema.columns c
                            ON kcu.table_name = c.table_name
                            AND kcu.column_name = c.column_name
                        WHERE tc.constraint_type = 'PRIMARY KEY'
                        AND tc.table_schema = 'public'
                        ORDER BY kcu.table_name;

                            """
            ))  
            
        for row in result :
            print("tabla : " , row)  
    except SQLAlchemyError as e :
        print("error realizando las consulta , ", e)    


def revisar_columnas():
    try:
        with engine.connect() as conn :
            result = conn.execute(text(
                        """
                        SELECT 
                            column_name, 
                            data_type, 
                            is_nullable, 
                            character_maximum_length
                        FROM information_schema.columns
                        WHERE table_name = 'ticket'
                        ORDER BY ordinal_position;

                            """
            ))  
            
        for row in result :
            print("tabla : " , row)  
    except SQLAlchemyError as e :
        print("error realizando las consulta , ", e)    

        
if __name__ == "__main__":
    #test_connection()
    #tables_in_database()
    #revisar_tipos_PK()
    revisar_columnas()