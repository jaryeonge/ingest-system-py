FROM node:12.2.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY /package.json /app/package.json
COPY . .
RUN npm install

CMD ["npm", "start"]