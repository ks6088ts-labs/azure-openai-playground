FROM node:18.16.0-bullseye-slim

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
