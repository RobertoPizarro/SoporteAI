from langchain_core.prompts import PromptTemplate
import json

class AgenteDeContexto :

  def __init__(self, llm = None, condiciones = None) -> None:
    self.llm = llm
    self.condiciones = condiciones

    self.promptTemplate = PromptTemplate.from_template(
        """
      Vas a revisar que los mensajes que recibas cumplan estas condiciones

      {condiciones}

      Si sí cumplen responderás con un JSON con esta única variable:

      - "status": "PROMPT_VALIDO"
      - "message": Una explicación breve del por qué sí se cumplen las condiciones

      Sino, responderás con un JSON con estas 2 variables:

      - "status": "PROMPT_NO_VALIDO"
      - "message": Una explicación breve del por qué no se cumplen las condiciones

      Sólo debes devolver el JSON, no debes agregar texto, comentarios adicionales o variables que no te haya pedido

      El mensaje es el siguiente:

      {mensaje}
        """
    )

  def enviarMensaje(self, prompt : str) :

    consulta = self.promptTemplate.format(condiciones = self.condiciones, mensaje = prompt)

    respuestaModelo = self.llm.invoke(consulta).content.replace("```json", "").replace("```", "")

    try :
      respuesta = json.loads(respuestaModelo)

    except Exception as e :
      respuesta = {
        "status": "ERROR",
        "message": f"Ocurrió un error al parsear la respuesta del modelo: {respuestaModelo.content}"
      }
      print(f"Error : {e}")

    return respuesta
