# Use the official Node.js image based on Debian
FROM node:20-slim

# Install dependencies for Chromium, Puppeteer, node-gyp, and FFmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    chromium \
    libgbm-dev \
    ffmpeg \
    ca-certificates \
    fonts-liberation \
    libfreetype6 \
    libharfbuzz0b \
    libnss3 \
    libx11-6 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Tell Puppeteer to use the installed Chromium and skip downloading it
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Command to run the application
CMD ["npm", "start"]

# Instructions to build and run the Docker container:
# docker build -t musyk .
# docker run --env-file src/.env -d musyk