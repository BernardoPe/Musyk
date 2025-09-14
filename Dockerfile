FROM node:22.11.0-slim

RUN apt-get update && apt-get install -y \
     g++ \
     git \
     make \
     python3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client
RUN npx prisma generate --no-engine --schema=./src/storage/schema.prisma

# Command to run the application
CMD ["npm", "start"]

# Instructions to build and run the Docker container:
# docker build -t musyk .
# docker run --env-file .env -d musyk