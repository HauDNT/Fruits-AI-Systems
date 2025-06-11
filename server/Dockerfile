# Dockerfile in NestJS

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build app (NextJS will create .nest folder)
RUN npm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]