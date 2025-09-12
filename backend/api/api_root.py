from flask import Blueprint, jsonify, request
from backend.flow.AgentAsTools import AgentsAsTools

root_bp = Blueprint("root", __name__)
orq = AgentsAsTools()

@root_bp.get("/")
def home():
    return "API de IA activa. Usa POST /user/chat para enviar preguntas."

@root_bp.post("/user/chat")
def chat():
    datos = request.get_json()
    mensaje = datos.get("mensaje", "")
    print("Mensaje recibido:", mensaje)
    respuesta = orq.enviarMensaje(mensaje)
    return jsonify({"respuesta": respuesta})