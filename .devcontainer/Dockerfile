FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

ENV DEBIAN_FRONTEND=noninteractive

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash-completion \
    build-essential \
    ca-certificates \
    curl \
    git \
    openssl \
    procps \
    ripgrep \
    rsync \
    unzip \
    bubblewrap \
    && rm -rf /var/lib/apt/lists/*

RUN chmod u+s /usr/bin/bwrap

USER root

RUN corepack enable \
    && npm install --global pm2

USER node
WORKDIR /workspaces/reflecta-mono
