FROM node:latest

WORKDIR /app/products

COPY package.json .

RUN npm install


COPY src .

EXPOSE 8002

CMD ["npm", "start"]