FROM node:18
ENV NODE_ENV production
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY swagger.json ./
COPY .env ./
COPY .env.prod ./
COPY src/ ./src
RUN npm install --ignore-scripts
RUN npm run build:prod
EXPOSE 8080 
CMD npm start
