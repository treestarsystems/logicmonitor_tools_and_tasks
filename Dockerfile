# Base image
FROM node:24.13.0-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Copy app config files
COPY schedule-conf.json ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start:prod"]