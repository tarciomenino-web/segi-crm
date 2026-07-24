# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml ./

# Copy workspace package files
COPY apps/web ./apps/web
COPY packages ./packages

# Install dependencies
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile

# Build application
RUN pnpm run build --filter=web

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy root package files
COPY package.json pnpm-lock.yaml ./

# Copy packages
COPY packages ./packages

# Copy web app
COPY apps/web ./apps/web

# Copy built files from builder
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules ./node_modules

# Install dependencies for production only
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})" || exit 1

# Start application
CMD ["pnpm", "start", "--filter=web"]
