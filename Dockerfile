# ---------- Stage 1 ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build


# ---------- Stage 2 ----------
FROM node:20-alpine

WORKDIR /backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/ .

# Copy frontend build into backend
COPY --from=frontend-builder /frontend/dist ./public

EXPOSE 3000

CMD ["npm", "start"]