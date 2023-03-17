FROM node:latest
RUN mkdir /app
WORKDIR /node-boilerplate 
COPY package.json  /app/
RUN npm install 
COPY .  /app/
EXPOSE 8080 
CMD npm start
