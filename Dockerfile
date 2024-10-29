# Usa una imagen base de Node.js versión 18
FROM node:18

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos del proyecto
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Define el comando de inicio de la aplicación
CMD [ "node", "index.js" ]
