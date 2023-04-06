FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Basic deps for Node.js
RUN apk update && apk add --no-cache dumb-init python3 libc-dev make g++

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=dev

# Copy app source code
COPY . .

EXPOSE 3000
ENTRYPOINT ["dumb-init"]
CMD [ "node", "server-all-addresses.js" ]
