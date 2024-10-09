# Step 1: Use node image to build the React app
FROM node:16-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application and build it
COPY . .
RUN npm run build

# Step 5: Use the official Nginx image to serve the app
FROM nginx:stable-alpine

# Step 6: Copy the build output to Nginx's default directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 7: Expose port 80 to the outside world
EXPOSE 80

# Step 8: Start Nginx
CMD ["nginx", "-g", "daemon off;"]