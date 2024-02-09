# Use an official Node.js runtime as a base image
FROM ubuntu

# Install any dependencies required for your Express app
RUN npm install -g nodemon

# Set the working directory in the container
WORKDIR /app

# Install Nmap
RUN apt-get update && \
    apt-get install -y nmap \
    whois \
    dirsearch \
    npm install xml2js && \ 
     


    

# Copy the rest of your application code
COPY . .

# Set node_modules to be a volume mount
 VOLUME [ "node_modules" ]

# Install app dependencies
RUN npm i

# Expose the port your app will run on
EXPOSE 3001

# Define the command to run your application
CMD ["nodemon" ,"index.js" ]
