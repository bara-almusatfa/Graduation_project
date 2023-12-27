# Use an official Node.js runtime as a base image
FROM node:16

# Install any dependencies required for your Express app
RUN npm install -g nodemon

# Set the working directory in the container
WORKDIR /app

# Install Nmap
RUN apt-get update && \
    apt-get install -y nmap \
    whois \
    sqlmap \
    npm install -g xml2json \ 
    gem install nmap2json \ 

    

# Copy the rest of your application code
COPY . .

# Set node_modules to be a volume mount
 VOLUME [ "node_modules" ]

# Install app dependencies
RUN npm i

# Expose the port your app will run on
EXPOSE 3001

# Define the command to run your application
CMD ["npm", "run", "dev"]
