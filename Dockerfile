FROM node:20.15.0-slim

ENV NODE_ENV=production
WORKDIR /home/nodeuser/app
COPY package.json ./
COPY tsconfig.json ./
COPY swagger.json ./
COPY .env ./
COPY src/ ./src
RUN npm install --ignore-scripts
RUN npm run build
EXPOSE 8082 
CMD ["npm", "start"]
