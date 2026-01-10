FROM node:18-alpine

# Required for sqlite3 native builds
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy only package files
COPY server/package*.json ./

# Install deps INSIDE container (Linux)
RUN npm install

# Copy app source (no node_modules)
COPY server/. .

EXPOSE 8080

CMD ["node", "src/server.js"]
