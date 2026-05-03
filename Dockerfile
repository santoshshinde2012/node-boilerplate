# syntax=docker/dockerfile:1.7

############################
# 1. Build stage
############################
FROM node:22-bookworm-slim AS builder

ENV CI=true \
    NODE_ENV=development

WORKDIR /app

# Apply latest OS-level security patches in the build image too,
# so anything that leaks into the runtime via /app stays patched.
RUN apt-get update \
    && apt-get -y upgrade \
    && rm -rf /var/lib/apt/lists/*

# install ALL deps (incl. devDependencies) reproducibly
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# copy sources and compile
COPY tsconfig.json ./
COPY swagger.json ./
COPY src ./src
RUN npm run build

# prune dev deps for the runtime image
RUN npm prune --omit=dev

############################
# 2. Runtime stage
############################
FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    PORT=8080 \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

# Patch base OS packages and add tini for proper PID-1 signal handling.
RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get install -y --no-install-recommends tini ca-certificates \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# non-root user
RUN groupadd --system --gid 1001 nodejs \
    && useradd  --system --uid 1001 --gid nodejs --home /home/nodeuser --shell /usr/sbin/nologin nodeuser \
    && mkdir -p /home/nodeuser/app/logs \
    && chown -R nodeuser:nodejs /home/nodeuser

WORKDIR /home/nodeuser/app

COPY --chown=nodeuser:nodejs --from=builder /app/build ./build
COPY --chown=nodeuser:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs --from=builder /app/package.json ./package.json
COPY --chown=nodeuser:nodejs --from=builder /app/swagger.json ./swagger.json

USER nodeuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||8080)+'/healthz',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "build/src/server.js"]
