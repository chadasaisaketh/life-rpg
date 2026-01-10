FROM node:18-alpine

WORKDIR /app

# Copy package.json from server folder
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy rest of server code
COPY server/. .

# Expose Railway port
EXPOSE 8080

# Start app
CMD ["node", "src/server.js"]
