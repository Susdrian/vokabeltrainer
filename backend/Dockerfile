# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json, falls vorhanden, und installiere Abhängigkeiten
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (ersetze ggf. die Portnummer)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
