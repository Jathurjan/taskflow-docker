
# Use Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Backend port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
