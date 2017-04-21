FROM node:latest

RUN mkdir -p /usr/woobi
WORKDIR /usr/woobi

COPY package.json /usr/woobi

RUN npm install

COPY . /usr/woobi

ENV PORT 5000
EXPOSE $PORT

CMD ["npm", "start"]
