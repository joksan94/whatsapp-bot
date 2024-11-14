const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// El chatId del grupo al que quieres que responda el bot
const grupoEspecifico = "5217226471028-1635736188@g.us";

// El chatId del usuario que puede activar o desactivar la escucha
const usuarioControl = "5217772585287@c.us";

// Variable para controlar si el bot está escuchando
let escuchando = true;

// Iniciar cliente de WhatsApp
const client = new Client({
  puppeteer: {
    headless: true, // Cambiado a true para despliegue en servidores como Heroku
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Opciones necesarias para Heroku
  },
});

client.on("qr", (qr) => {
  // Generar el QR para escanearlo en el móvil
  qrcode.generate(qr, { small: true });
  console.log("Escanea el QR con tu WhatsApp");
});

client.on("ready", () => {
  console.log("¡Bot de WhatsApp listo!");
  obtenerNombreGrupo();
});

client.on("message", (message) => {
  console.log("Mensaje recibido:", message.body, "de:", message.from);

  // Control de activación/desactivación de la escucha
  if (message.from === usuarioControl) {
    console.log("Mensaje de control recibido:", message.body);
    if (message.body.toLowerCase() === "activar") {
      escuchando = true;
      client.sendMessage(message.from, "La escucha ha sido activada.");
      console.log("La escucha ha sido activada por el usuario de control.");
      return;
    }
    if (message.body.toLowerCase() === "desactivar") {
      escuchando = false;
      client.sendMessage(message.from, "La escucha ha sido desactivada.");
      console.log("La escucha ha sido desactivada por el usuario de control.");
      return;
    }
  }

  // Responder a mensajes del grupo específico si la escucha está activada
  if (message.from === grupoEspecifico && escuchando) {
    console.log("Mensaje recibido del grupo específico:", message.body);
    const mensaje = message.body.toLowerCase();
    const palabrasClave = [
      "disponibilidad",
      "necesitan",
      "necesitamos",
      "requerimos",
      "se solicita",
      "solicitamos",
      "se necesita",
      "requiero",
      "necesito",
      "solicitan",
    ];

    if (palabrasClave.some((palabra) => mensaje.includes(palabra))) {
      console.log("Palabra clave encontrada en el mensaje:", message.body);
      client.sendMessage(message.from, "1 trailer caja seca");
    } else {
      console.log(
        "No se encontró ninguna palabra clave en el mensaje:",
        message.body
      );
    }
  } else if (message.from === grupoEspecifico) {
    console.log("La escucha está desactivada. Mensaje recibido:", message.body);
  } else {
    console.log("Mensaje recibido de un grupo diferente:", message.from);
  }
});

// Función para obtener el nombre del grupo (similar a tu código anterior)
async function obtenerNombreGrupo() {
  const chats = await client.getChats();
  const grupo = chats.find((chat) => chat.id._serialized === grupoEspecifico);
  if (grupo) {
    console.log(`Nombre del grupo: ${grupo.name}`);
  } else {
    console.log(
      `No se encontró ningún grupo con el chatId: ${grupoEspecifico}`
    );
  }
}

client.initialize();
