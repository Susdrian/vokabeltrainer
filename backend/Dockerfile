# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the backend source code into the image
COPY . .

# Install dependencies using npm
RUN npm install

# Set the entry point to start the backend server
CMD ["npm", "run", "dev"]
