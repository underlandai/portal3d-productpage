FROM node:lts AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS deploy
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/client/* /usr/share/nginx/html/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
