# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /frontend

# Clone your Next.js 13 application from GitHub
COPY . /frontend/

# Install application dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose port 3000 to the world outside this container
EXPOSE 3000

# Run the Next.js application when the container launches
CMD ["npm", "start"]
