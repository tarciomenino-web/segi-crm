# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml ./

# Copy workspace package files
COPY apps/api ./apps/api
COPY packages ./packages

# Install dependencies
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile

# Build application
RUN pnpm run build --filter=api

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy root package files
COPY package.json pnpm-lock.yaml ./

# Copy packages
COPY packages ./packages

# Copy API app
COPY apps/api ./apps/api

# Copy built files from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules

# Install dependencies for production only
RUN npm install -g pnpm@8 && pnpm install --frozen-lockfile --prod

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})"

# Start application
CMD ["node", "apps/api/dist/main.js"]
