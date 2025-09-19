from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import os
from dotenv import load_dotenv
from backend.util.util_conectar_orm import conectarORM
from backend.db.persona.create_persona import insertar_colaborador

auth_colab_router = APIRouter()
load_dotenv()
class LoginIn(BaseModel):
    id_token: str

@auth_colab_router.post("/google/colaborador")
def google_upsert(req: Request, body: LoginIn):
    idt = body.id_token
    if not idt:
        raise HTTPException(400, "missing id_token")

    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(500, "server_misconfig: GOOGLE_CLIENT_ID missing")

    try:
        info = id_token.verify_oauth2_token(idt, grequests.Request(), client_id)
        if info.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
            raise HTTPException(401, "invalid_google_token: bad_iss")
        if info.get("aud") != client_id:
            raise HTTPException(401, "invalid_google_token: aud_mismatch")
    except Exception as e:
        raise HTTPException(401, f"invalid_google_token: {e}")

    if not info.get("email_verified", True):
        raise HTTPException(403, "email_not_verified")

    sub   = info["sub"]
    email = info.get("email")
    name  = info.get("name") or (email.split("@")[0] if email else None)
    hd    = info.get("hd")

    with conectarORM() as db:
        out = insertar_colaborador(db, sub=sub, email=email, name=name, hd=hd)
    # guarda sesión mínima
    req.session["user"] = {
        "email": email,
        "name": name,
        "persona_id": out["persona_id"],
        "cliente_id": out["cliente_id"],
        "colaborador_id": out["colaborador_id"],
        "rol": "colaborador",
    }
    return {"ok": True, **out}
