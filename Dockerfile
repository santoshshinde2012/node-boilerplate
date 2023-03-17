FROM node:16.17.0-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci --only=production
USER node
EXPOSE 8080 
CMD npm start
