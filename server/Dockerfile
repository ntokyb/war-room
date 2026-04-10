FROM node:20-alpine

# better-sqlite3 needs build tools for native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

# SQLite data lives in a volume
RUN mkdir -p /app/data

EXPOSE 5050

CMD ["node", "index.js"]
