FROM node:carbon

# Setup work application folder
RUN mkdir /app
WORKDIR /app

# Copy dependencies list
COPY package*.json ./

# Install project dependencies
RUN npm install