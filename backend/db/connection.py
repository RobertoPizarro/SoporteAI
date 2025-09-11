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
        with engine.connect() as conn :
            result = conn.execute(text("""SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;"""))
            
            #conn.commit()
            i=1
            for row in result :
                print( f"Tablas{i} : ", row)
                i+=1
    except SQLAlchemyError as e:
        print("❌ Error al invocar las tablas de la BD:", str(e))
        
if __name__ == "__main__":
    #test_connection()
    tables_in_database()