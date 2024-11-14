const venom = require("venom-bot");

// El chatId del grupo al que quieres que responda el bot
const grupoEspecifico = "5217226471028-1635736188@g.us";

// El chatId del usuario que puede activar o desactivar la escucha
const usuarioControl = "5217772585287@c.us";

// Variable para controlar si el bot está escuchando
let escuchando = true;

venom
  .create({
    session: "mi-sesion",
    headless: true, // Cambiado a true para despliegue en servidores como Heroku
    useChrome: true,
    qrTimeout: 0,
    puppeteerOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Opciones necesarias para Heroku
    },
  })
  .then((client) => {
    console.log("Venom bot iniciado correctamente");
    obtenerNombreGrupo(client, grupoEspecifico);
    start(client);
  })
  .catch((error) => {
    console.log("Error iniciando venom bot:", error);
  });

function obtenerNombreGrupo(client, chatId) {
  console.log("Obteniendo nombre del grupo...");
  client
    .getAllChats()
    .then((chats) => {
      const grupo = chats.find((chat) => chat.id._serialized === chatId);
      if (grupo) {
        console.log(`Nombre del grupo: ${grupo.name}`);
      } else {
        console.log(`No se encontró ningún grupo con el chatId: ${chatId}`);
      }
    })
    .catch((error) => {
      console.log("Error obteniendo chats:", error);
    });
}

function start(client) {
  console.log("Iniciando escucha de mensajes...");
  client.onMessage((message) => {
    console.log("Mensaje recibido:", message.body, "de:", message.from);

    if (message.from === usuarioControl) {
      console.log("Mensaje de control recibido:", message.body);
      if (message.body.toLowerCase() === "activar") {
        escuchando = true;
        client.sendText(message.from, "La escucha ha sido activada.");
        console.log("La escucha ha sido activada por el usuario de control.");
        return;
      }
      if (message.body.toLowerCase() === "desactivar") {
        escuchando = false;
        client.sendText(message.from, "La escucha ha sido desactivada.");
        console.log(
          "La escucha ha sido desactivada por el usuario de control."
        );
        return;
      }
    }

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
        client.sendText(message.from, "1 trailer caja seca");
      } else {
        console.log(
          "No se encontró ninguna palabra clave en el mensaje:",
          message.body
        );
      }
    } else if (message.from === grupoEspecifico) {
      console.log(
        "La escucha está desactivada. Mensaje recibido:",
        message.body
      );
    } else {
      console.log("Mensaje recibido de un grupo diferente:", message.from);
    }
  });
}
