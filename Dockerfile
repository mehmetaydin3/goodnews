# ── Stage 1: Install all dependencies ────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy every package.json so npm workspaces can resolve the graph
COPY package*.json ./
COPY shared/package.json ./shared/
COPY api/package.json ./api/
COPY agents/fetcher/package.json    ./agents/fetcher/
COPY agents/deduper/package.json    ./agents/deduper/
COPY agents/classifier/package.json ./agents/classifier/
COPY agents/summarizer/package.json ./agents/summarizer/
COPY agents/reshare/package.json    ./agents/reshare/
COPY agents/analytics/package.json  ./agents/analytics/
COPY frontend/package.json ./frontend/

# Install everything (including devDeps — needed for ts-node + typescript)
RUN npm ci

# ── Stage 2: Build shared library ─────────────────────────────────────────────
FROM deps AS builder
COPY . .
RUN npm run build --workspace=shared

# ── Stage 3: API service ───────────────────────────────────────────────────────
FROM builder AS api
ENV NODE_ENV=production
EXPOSE 3001
# Runs DB migrations then starts the API
CMD ["sh", "-c", "npm run db:deploy && npm run start --workspace=api"]

# ── Stage 4: Agents service ────────────────────────────────────────────────────
FROM builder AS agents
ENV NODE_ENV=production
CMD ["npm", "run", "agents:all"]
