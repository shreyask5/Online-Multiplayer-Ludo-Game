# Use Node 18 for backend
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend files (including build directory)
COPY . .

# Install backend dependencies
RUN npm install

# Expose backend port
EXPOSE 8080

# Run the backend server
CMD ["node", "server.js"] 