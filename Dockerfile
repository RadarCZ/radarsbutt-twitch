FROM node:lts-alpine
LABEL maintainer="Lukáš 'Radar' Kubíček <kubicek@radarsoft.cz>"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN rm -rf ./src

ENTRYPOINT [ "npm", "start" ]