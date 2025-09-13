from flask import Blueprint, request, jsonify, current_app
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from backend.util.util_conectar_orm import conectarORM
from backend.db.persona.create_persona import insertar_colaborador
from flask import current_app
import base64, json
import os

auth_colaborador_bp = Blueprint("auth_colaborador", __name__)

def _peek_id_token_aud(id_token_str: str):
    try:
        # decodificar payload sin verificar (solo para debug)
        payload_b64 = id_token_str.split(".")[1] + "=="
        payload_json = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        payload = json.loads(payload_json)
        aud = payload.get("aud")
        iss = payload.get("iss")
        sub = payload.get("sub")
        email = payload.get("email")
        return {"aud": aud, "iss": iss, "sub": sub[:6] + "…", "email": email}
    except Exception:
        return None

@auth_colaborador_bp.post("/google/colaborador")
def google_upsert():
    payload = request.get_json() or {}
    id_token_str = payload.get("id_token")
    if not id_token_str:
        return jsonify({"error": "missing id_token"}), 400

    # DEBUG: mostrar aud/iss del token y el CLIENT_ID esperado
    peek = _peek_id_token_aud(id_token_str)
    current_app.logger.info("DEBUG peek token: %s", peek)
    current_app.logger.info("DEBUG expected CLIENT_ID: %s", os.getenv("GOOGLE_CLIENT_ID"))

    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not google_client_id:
        return jsonify({"error": "server_misconfig", "detail": "GOOGLE_CLIENT_ID missing in Flask config"}), 500

    try:
        info = id_token.verify_oauth2_token(id_token_str, grequests.Request(), google_client_id)
        # chequeos defensivos extra
        if info.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
            return jsonify({"error": "invalid_google_token", "detail": f"bad_iss:{info.get('iss')}"}), 401
        if info.get("aud") != google_client_id:
            return jsonify({"error": "invalid_google_token", "detail": f"aud_mismatch token:{info.get('aud')} expected:{google_client_id}"}), 401
    except Exception as e:
        return jsonify({"error": "invalid_google_token", "detail": str(e)}), 401

    if not info.get("email_verified", True):
        return jsonify({"error": "email_not_verified"}), 403

    sub = info["sub"]
    email = info.get("email")
    name  = info.get("name")
    hd    = info.get("hd")

    with conectarORM() as db:
        out = insertar_colaborador(db, sub=sub, email=email, name=name, hd=hd)
        return jsonify(out), 200