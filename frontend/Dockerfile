FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

RUN npm install -g @angular/cli

COPY . .

# Install nginx
RUN apt-get update && apt-get install -y nginx

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
