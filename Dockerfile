FROM node:13.8-stretch

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

ENV NODE_ENV production
ENV ENV production
# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build

EXPOSE 7001

# Running the app
CMD [ "npm", "start" ]