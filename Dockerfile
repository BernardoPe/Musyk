FROM node:22-slim AS base

# ffmpeg is only needed for seeking, filters and non-Opus sources. Nothing is compiled:
# installs run with --ignore-scripts and every native module ships prebuilt binaries.
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

FROM base AS deps

COPY package*.json ./
COPY patches ./patches
RUN npm ci --ignore-scripts && npx patch-package

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
# --omit=peer keeps optional peers such as the Prisma CLI out of the image; every peer
# needed at runtime is a direct dependency.
RUN npm ci --omit=dev --omit=peer --ignore-scripts && npx patch-package && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/generated ./src/generated
COPY --from=builder /usr/src/app/src/storage/schema.prisma ./src/storage/schema.prisma

CMD ["node", "dist/bot.js"]

# Instructions to build and run the Docker container:
# docker build -t musyk .
# docker run --env-file .env -d musyk