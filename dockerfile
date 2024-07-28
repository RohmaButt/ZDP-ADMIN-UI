
FROM node:latest as build-step

RUN mkdir /app

WORKDIR /app

COPY package.json .npmrc /app/

RUN npm install

COPY . /app

RUN npm run build

# Stage 2
FROM nginx:stable-alpine-perl

COPY --from=build-step /app/default.conf /etc/nginx/conf.d/default.conf

RUN mkdir /usr/share/nginx/html/admin

COPY --from=build-step /app/build /usr/share/nginx/html/admin