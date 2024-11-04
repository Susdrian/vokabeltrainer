# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the frontend source code into the image
COPY . .

# Install dependencies using npm
RUN npm install

# Build the frontend application
RUN npm run build

# Serve the frontend using nginx
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
