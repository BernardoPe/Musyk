# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Python, Make, and G++ (required for node-gyp)
RUN apk add --update python3 make g++\ && rm -rf /var/cache/apk/*

# Install dependencies with verbose output
RUN npm i --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Install FFmpeg using apk (for Alpine Linux)
RUN apk update && apk add --no-cache ffmpeg

# Cleanup unnecessary cache to minimize image size
RUN rm -rf /var/cache/apk/* /tmp/*

# Command to run the application
CMD ["npm", "start"]

# to build and deploy the Docker image, run the following commands:
# docker build -t musyk .
# docker run --env-file src/.env -d musyk