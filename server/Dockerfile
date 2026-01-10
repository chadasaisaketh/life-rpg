FROM node:18-bullseye

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies (native sqlite3 works here)
RUN npm install

# Copy app source
COPY server/. .

EXPOSE 8080

CMD ["node", "src/server.js"]
