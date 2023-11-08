
FROM node:21-alpine

WORKDIR /app/backend

COPY ./backend/package*.json ./

RUN npm install

COPY ./frontend/dist public

COPY ./backend ./

CMD ["node", "index.js"]
