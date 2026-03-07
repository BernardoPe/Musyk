FROM node:22.12-slim AS base

RUN apt-get update && apt-get install -y \
     ffmpeg \
     g++ \
     git \
     make \
     python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

FROM base AS deps

COPY package*.json ./
COPY patches ./patches
RUN npm install --ignore-scripts && npx patch-package

FROM deps AS builder

COPY tsconfig.json ./
COPY tsup.config.ts ./
COPY src ./src
RUN npm run db:generate
RUN npm run build

FROM base AS production

ENV NODE_ENV=production

COPY package*.json ./
COPY patches ./patches
RUN npm install --omit=dev --ignore-scripts && npx patch-package

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/generated ./src/generated
COPY --from=builder /usr/src/app/src/storage/schema.prisma ./src/storage/schema.prisma

CMD ["npm", "start"]

# Instructions to build and run the Docker container:
# docker build -t musyk .
# docker run --env-file .env -d musyk