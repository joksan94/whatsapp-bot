const venom = require("venom-bot");

// El chatId del grupo al que quieres que responda el bot
const grupoEspecifico = "5217226471028-1635736188@g.us"; // ChatId del grupo "
//"120363334875848107@g.us" test
//"5217226471028-1635736188@g.us" transporte

// El chatId del usuario que puede activar o desactivar la escucha
const usuarioControl = "5217772585287@c.us"; // Reemplaza con el chatId del usuario de control

// Variable para controlar si el bot está escuchando
let escuchando = true;

venom
  .create({ session: "mi-sesion", headless: true }) // Cambiado a headless: true
  .then((client) => {
    console.log("Venom bot iniciado correctamente");
    obtenerNombreGrupo(client, grupoEspecifico); // Obtener el nombre del grupo
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

    // Comandos para activar o desactivar la escucha desde el chat privado
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

    // Verificar que el mensaje proviene del grupo específico y que la escucha está activada
    if (message.from === grupoEspecifico && escuchando) {
      console.log("Mensaje recibido del grupo específico:", message.body);
      const mensaje = message.body.toLowerCase();
      const palabrasClave = [
        "disponibilidad",
        "necesitan",
        "necesitamos",
        "Necesitamos",
        "Requerimos",
        "requerimos",
        "se solicita",
        "solicitamos",
        "Se necesita",
        "se necesita",
        "Requiero",
        "requiero",
        "Solicitan",
        "solicitan",
        "Necesito",
        "necesito",
      ];

      if (palabrasClave.some((palabra) => mensaje.includes(palabra))) {
        console.log("Palabra clave encontrada en el mensaje:", message.body);
        // Responder automáticamente solo en el grupo especificado
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
