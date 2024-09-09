FROM --platform=linux/amd64 node:18-slim

RUN apt-get update -y && apt-get install -y openssl && apt-get install libssl-dev

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

EXPOSE 3344

CMD [ "yarn", "start" ]