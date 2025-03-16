# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 3000 (or your chosen port)
EXPOSE 3000

# Define environment variables if needed
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
