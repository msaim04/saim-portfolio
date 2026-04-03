FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN npm install && npm install --workspace server && npm install --workspace client

COPY . .

RUN npm run build --workspace client


FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN npm install --omit=dev && npm install --workspace server

COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start", "--workspace", "server"]
