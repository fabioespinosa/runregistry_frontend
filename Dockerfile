FROM node:latest

WORKDIR /usr/app

RUN export ENV=development && export NODE_ENV=development
COPY package.json .
RUN npm install --quiet

COPY . .