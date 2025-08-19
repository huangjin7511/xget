# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json first to leverage Docker cache for dependencies
COPY package.json ./

# Install dependencies including express for standalone server
RUN npm ci --only=production && npm install express

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
	adduser -S xget -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R xget:nodejs /app

# Switch to the non-root user
USER xget

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
