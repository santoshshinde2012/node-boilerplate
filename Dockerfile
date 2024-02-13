FROM node:iron-bookworm-slim

# Create a new user named "nodeuser"
RUN useradd --user-group --create-home --system --skel /dev/null --shell /bin/false nodeuser

# Switch to the new user
USER nodeuser

ENV NODE_ENV production
WORKDIR /home/nodeuser/app
COPY package.json ./
COPY tsconfig.json ./
COPY swagger.json ./
COPY .env ./
COPY src/ ./src
RUN npm install --ignore-scripts
RUN npm run build
EXPOSE 8080 
CMD npm start
