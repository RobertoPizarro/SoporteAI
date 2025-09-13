# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
import uvicorn
from backend.api.api_auth_colaborador import auth_colab_router
from backend.api.api_auth_analista import auth_analista_router
from backend.api.api_root import chat_router
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos  # -> (conn_cm, saver)
# Lifespan: abre PostgresSaver al inicio y ciérralo al final
@asynccontextmanager
async def lifespan(app: FastAPI):
    conn_cm, saver = obtenerConexionBaseDeDatos()  # context manager + PostgresSaver real
    app.state.conn_cm = conn_cm
    app.state.checkpointer = saver
    print("Checkpointer listo:", type(saver).__name__ if saver else None)
    try:
        yield
    finally:
        try:
            if getattr(app.state, "conn_cm", None) is not None:
                app.state.conn_cm.__exit__(None, None, None)  # cerrar UNA vez
        except Exception:
            pass

app = FastAPI(title="IAnalytics API", lifespan=lifespan)

# CORS (ajusta origins a tu front real)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # tu front
    allow_credentials=True,   # cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cookie de sesión
app.add_middleware(
    SessionMiddleware,
    secret_key="cambia-esto-en-prod",
    same_site="none",   # si el front está en otro origen
    https_only=False,   # pon True en producción HTTPS
    # session_cookie="malcriados_session",
)

# Routers
app.include_router(auth_colab_router,     prefix="/auth", tags=["auth"])
app.include_router(auth_analista_router,  prefix="/auth", tags=["auth"])
app.include_router(chat_router,                        tags=["chat"])

@app.get("/")
def home():
    return {"ok": True, "msg": "API de IA activa. Usa POST /user/chat"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)