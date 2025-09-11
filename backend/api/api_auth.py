# backend/api/auth.py
from flask import Blueprint, request, jsonify, current_app
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from backend.util.util_conectar_orm import conectarORM
from backend.db.persona.create_persona import insertar_colaborador

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/google/upsert")  # POST /auth/google/upsert
def google_upsert():
    # seguridad interna: que solo tu NextAuth lo llame
    if request.headers.get("X-Internal-Auth") != current_app.config.get("INTERNAL_SHARED_SECRET"):
        return jsonify({"error": "unauthorized"}), 401

    payload = request.get_json() or {}
    id_token_str = payload.get("id_token")
    if not id_token_str:
        return jsonify({"error": "missing id_token"}), 400

    # verifica el id_token con Google
    try:
        info = id_token.verify_oauth2_token(
            id_token_str, grequests.Request(), current_app.config["GOOGLE_CLIENT_ID"]
        )
    except Exception as e:
        return jsonify({"error": "invalid_google_token", "detail": str(e)}), 401

    if not info.get("email_verified", True):
        return jsonify({"error": "email_not_verified"}), 403

    sub = info["sub"]
    email = info.get("email")
    name  = info.get("name")
    hd    = info.get("hd")

    with conectarORM() as db:
        out = insertar_colaborador(
            db, sub=sub, email=email, name=name, hd=hd
            # o False si quieres fallback
        )
        return jsonify(out), 200
