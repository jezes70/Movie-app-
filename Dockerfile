FROM node:16-alpine

WORKDIR /app

COPY . .

COPY package.json .
COPY yarn.lock .

COPY .env ./

RUN yarn

RUN yarn compile

CMD ["yarn", "start"]

EXPOSE 3000

