# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Expose the port for the Angular dev server
EXPOSE 4200

# Start the Angular dev server
CMD ["ng", "serve", "--host", "0.0.0.0"]
