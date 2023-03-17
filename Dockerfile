FROM node:16.17.0-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node package.json /usr/src/app
COPY --chown=node:node .env /usr/src/app
COPY --chown=node:node swagger.json /usr/src/app
COPY --chown=node:node src/ /usr/src/app
RUN npm ci --only=production
USER node
EXPOSE 8080 
CMD npm start
