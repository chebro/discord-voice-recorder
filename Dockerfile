FROM node:lts-alpine3.12

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

ENV NODE_ENV production

COPY package*.json /usr/src/bot/
RUN npm ci --only=production

COPY . /usr/src/bot
CMD ["node", "index.js"]
