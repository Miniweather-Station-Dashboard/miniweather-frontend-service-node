# Install dependencies and build
FROM node:18-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

# Copy everything including .env
COPY . .

# Next.js will read variables from .env (NEXT_PUBLIC_*)
RUN echo "Building Next.js app..." \
  && npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
