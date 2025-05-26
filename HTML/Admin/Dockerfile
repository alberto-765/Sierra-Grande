# Use Node.js 18 LTS as base image
FROM node:18-alpine


# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the project files
COPY . .

# Install gulp globally if needed (or use local gulp)
RUN npm install -g gulp-cli http-server

# Run gulp to build assets (adjust command if different)
RUN gulp build

# Expose port 8080 (or change if needed)
EXPOSE 3001

# Start a simple HTTP server to serve the build directory
# Replace 'dist' with actual output folder if different
CMD ["http-server", "dist", "-p", "8080"]
