export const sendMessage = async (message: string) => {
  const response = await fetch("http://127.0.0.1:5000/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mensaje: message }),
  });

  if (!response.ok) {
    throw new Error("Error en la respuesta del servidor");
  }

  const data = await response.json();
  return data.respuesta;
};
