# ================================================================
# Stage 1: Buid
# ================================================================
FROM node:22-alpine AS builder

# O Prisma precisa do OpenSSL para gerar o cliente prisma
RUN apk update && apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

# ================================================================
# Stage 2: Production
# ================================================================
FROM node:22-alpine AS production

# O Prisma precisa do OpenSSL para gerar o cliente prisma
RUN apk update && apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

CMD [ "npm", "start" ]