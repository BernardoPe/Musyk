# Use the official Node.js image based on Debian
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the application
CMD ["npm", "start"]

# Instructions to build and run the Docker container:
# docker build -t musyk .
# docker run --env-file .env -d musyk