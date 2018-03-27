FROM node:carbon-alpine

WORKDIR /usr/src/app
COPY package.json .

RUN npm install
EXPOSE 8080
