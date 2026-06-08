FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Prisma generate needs DATABASE_URL to parse the schema. We set a build-time dummy;
# docker-compose will override it at runtime.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/primetrade?schema=public"

RUN npx prisma generate --schema=./prisma/schema.prisma

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/docker-entrypoint.sh"]

