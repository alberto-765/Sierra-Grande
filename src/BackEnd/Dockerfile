#Usamos la imagen oficial de node
FROM node:20

#Asignamos el directorio donde se va a crear la app en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./


# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Expone el puerto en el que Strapi estará disponible
EXPOSE 1337

# Comando para iniciar Strapi en modo desarrollo
CMD ["npm", "run", "develop"]