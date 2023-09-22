FROM node:alpine

WORKDIR /coin_api

COPY package*.json ./

RUN npm install

COPY server.js ./

EXPOSE 7000

CMD ["node","server.js"]  