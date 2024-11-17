# Use the official Node.js slim image
FROM node:20.16.0-slim

# Set environment variables
ENV NODE_ENV=production

# Create and set the working directory
WORKDIR /home/nodeuser/app

# Create a non-root user
RUN useradd -m -s /bin/bash nodeuser && chown -R nodeuser:nodeuser /home/nodeuser

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --ignore-scripts --only=production

# Copy the rest of the application code
COPY tsconfig.json ./
COPY swagger.json ./
COPY src/ ./src

# Build the project
RUN npm run build

# Change to the non-root user
USER nodeuser

# Expose the port the app runs on
EXPOSE 8082

# Set the command to start the application
CMD ["npm", "start"]
