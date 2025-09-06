from backend.util.util_key import obtenerAPI
from backend.util.util_sincronizacion import cargarArchivoDeCarpeta
from backend.util.util_base_de_datos import obtenerConexionBaseDeDatos
from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.flow.AgentAsTools import AgentsAsTools

orq = AgentsAsTools()
app = Flask(__name__)
CORS(app)  # Permitir conexión desde Next.js

<<<<<<< HEAD
@app.route("/", methods=["GET"])
def home():
    return "API de IA activa. Usa POST /user/login para enviar preguntas."
=======
# FastAPI - Flask

# Dentro de las comillas agregar el prompt
print(orq.enviarMensaje(""))
>>>>>>> 17577a473fb6355e106849db226ce92cf0932bae

@app.route("/user/login", methods=["POST"])
def chat():
    datos = request.get_json()
    mensaje = datos.get("mensaje", "")
    print("Mensaje recibido:", mensaje)
    respuesta = orq.enviarMensaje(mensaje)  # tu lógica de IA
    return jsonify({"respuesta": respuesta})

if __name__ == "__main__":
    app.run(debug=True, port=5000)