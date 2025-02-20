


# Use an official Node.js runtime as the base image
FROM node:19.6.0-alpine as build

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Server With Nginx
FROM nginx:1.23-alpine 
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/build .

# Copy the Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
