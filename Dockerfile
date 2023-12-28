# Start with an Ubuntu base image
FROM ubuntu:latest

# Install Python and other necessary packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    make \
    redis-server \
    git

# Install Node.js (for React)
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the project files into the container
COPY . .

# Set up Python virtual environment
RUN python3 -m venv env
ENV PATH="/usr/src/app/env/bin:$PATH"

# Install dependencies
RUN make install

# Expose ports (Django and React)
EXPOSE 8000 3000

# Run the application
CMD ["make", "dev"]
