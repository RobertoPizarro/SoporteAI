import { Message } from "@/types";

export const conversationFlow: Message[] = [
  {
    type: "user",
    content: "Hola",
  },
  {
    type: "bot",
    content:
      "¡Hola! Soy el asistente virtual de Analytics Support. Estoy aquí para ayudarte con cualquier consulta o incidencia que tengas con nuestros servicios. Por favor, describe tu problema o requerimiento.",
    delay: 1000,
  },
  {
    type: "user",
    content:
      "Soy de la empresa Claro. Tengo problemas con el servicio de GeoPoint.",
  },
  {
    type: "bot",
    content:
      "Gracias por contactarnos. Para poder brindarte el mejor soporte y registrar tu consulta correctamente, necesito validar tu identidad. ¿Podrías proporcionarme tu nombre completo o tu DNI, por favor?",
    delay: 1500,
  },
  {
    type: "user",
    content: "Mi DNI es 75311031",
  },
  {
    type: "bot",
    content:
      "¡Perfecto, Roberto! He verificado tu identidad exitosamente. Veo que tienes problemas con el servicio de GeoPoint. Para poder asistirte de la mejor manera, ¿podrías proporcionarme más detalles específicos sobre el inconveniente que estás experimentando?",
    delay: 1500,
  },
  {
    type: "user",
    content:
      "El servicio de GeoPoint está mostrando mi ubicación en un lugar incorrecto del mapa. Este problema comenzó desde ayer y no logro entender la causa. La precisión de geolocalización se ha visto comprometida.",
  },
  {
    type: "bot",
    content:
      "Entiendo perfectamente la situación, Roberto. Los problemas de precisión en geolocalización pueden afectar significativamente las operaciones. Procederé inmediatamente a crear un ticket de soporte para que nuestro equipo técnico especializado pueda atender tu caso con la prioridad que requiere.",
    delay: 2000,
  },
  {
    type: "bot",
    content:
      "He generado tu ticket de soporte. A continuación te muestro los detalles para tu confirmación:",
    delay: 1000,
  },
  {
    type: "ticket",
    content: {
      id: "TCK-2025-00847",
      tipo: "Incidencia",
      usuario: "Roberto Pizarro",
      analista: "Juan Pérez",
      asunto:
        "Error de Precisión en el Servicio GeoPoint para la Empresa Claro",
      servicio: "Geo Solutions",
      nivel: 2,
      estado: "Nuevo",
      fechaCreacion: "22/08/2025",
      actualizacion: " ",
    },
    delay: 1500,
  },
  {
    type: "user",
    content: "Sí, está correcto. Confirmo todos los datos del ticket.",
  },
  {
    type: "bot",
    content:
      "¡Excelente! Tu ticket ha sido registrado exitosamente en nuestro sistema. Nuestro equipo de especialistas en Geo Solutions ya ha sido notificado y comenzarán a trabajar en tu caso. Te recomendamos ingresar nuevamente en aproximadamente 30 minutos para consultar el progreso de tu incidencia. ¡Gracias por confiar en Analytics Support!",
    delay: 2000,
  },
];
