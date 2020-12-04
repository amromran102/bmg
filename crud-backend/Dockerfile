 # Create image based on the official Node 6 image from the dockerhub
FROM node:carbon as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Stage 2 build for creating smaller image
FROM node:carbon-alpine
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 3000

CMD [ "npm", "start" ]