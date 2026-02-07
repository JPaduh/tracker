FROM mcr.microsoft.com/devcontainers/python:3.12

# Node.js (LTS) for Vite/React
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && apt-get install -y nodejs \
  && npm install -g npm@latest \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*