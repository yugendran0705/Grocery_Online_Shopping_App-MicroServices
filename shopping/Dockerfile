FROM node:latest

WORKDIR /app/shopping

COPY package.json .

RUN npm install

COPY src .

EXPOSE 8003

CMD ["npm", "start"]
