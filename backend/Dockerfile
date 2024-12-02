# Use Node.js base image with version 18.18 or higher
FROM node:18.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
