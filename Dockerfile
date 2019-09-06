ARG dev

FROM node:10-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD if [ "x$dev" = "x" ] ; then echo Argument not provided ; else npm start ; fi