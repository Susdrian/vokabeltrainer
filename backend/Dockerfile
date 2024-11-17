# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the backend source code into the image
COPY . .

# Install dependencies using npm
RUN npm install

# Expose the port the app runs on
EXPOSE 8000
# Set the entry point to start the backend server
CMD ["npm", "run", "dev"]
