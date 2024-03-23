# Use an official Node.js runtime as a base image
FROM ubuntu
ARG DEBIAN_FRONTEND=noninteractive
# Install any dependencies required for your Express app
RUN  apt-get update && \
    apt-get install -y \
    nodejs \
    npm \
    nmap \
    whois \
    dirsearch && \  
    npm install -g nodemon && \ 
    npm install express xml2js

# Set the working directory in the container

WORKDIR /usr/app
COPY ./ /usr/app

# Copy the rest of your application code
COPY . .

# Set node_modules to be a volume mount
VOLUME [ "node_modules" ]

# Install app dependencies
RUN npm install

# Expose the port your app will run on
EXPOSE 3001

# Define the command to run your application
CMD ["npm","start","&&","nodemon", "index.js"]
