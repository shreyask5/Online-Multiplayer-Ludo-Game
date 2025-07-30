# Build frontend
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

# Build backend
FROM node:18 AS backend
WORKDIR /app
COPY backend/package*.json ./
COPY backend/ ./
RUN npm install

# Final image
FROM node:18
WORKDIR /app

# Copy backend code and dependencies
COPY --from=backend /app /app

# Copy frontend build output
COPY --from=frontend /app/build /app/build

EXPOSE 8080

CMD ["npm", "run", "start"]