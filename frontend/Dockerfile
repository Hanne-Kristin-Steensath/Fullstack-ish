FROM node:21-alpine as build

WORKDIR /app/frontend

COPY ./frontend/package*.json ./

RUN npm install
# node_modules

COPY ./frontend .

RUN npm run build
# dist mappen har skapats

FROM nginx:stable-alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
