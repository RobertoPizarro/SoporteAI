from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

from backend.flow.AgentAsTools import AgentsAsTools

chat_router = APIRouter()

class ChatIn(BaseModel):
    mensaje: str

@chat_router.post("/user/chat")
def chat(req: Request, body: ChatIn):
    user = req.session.get("user") or {}
    if not user or not user.get("persona_id"):
        raise HTTPException(401, "unauthorized")

    saver = getattr(req.app.state, "checkpointer", None)
    if saver is None:
        raise HTTPException(500, "server_config: checkpointer ausente")

    orq = AgentsAsTools(user=user, saver=saver)
    respuesta = orq.enviarMensaje(body.mensaje)
    return {"respuesta": respuesta}
