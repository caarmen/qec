FROM ubuntu:24.04

# Avoid prompts from apt during installation.
ENV DEBIAN_FRONTEND=noninteractive

# Common tooling for React / web app development.
# build-essential and python3 are needed to compile native npm modules (node-gyp).
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    build-essential \
    ca-certificates \
    curl \
    git \
    python3 \
    && rm -rf /var/lib/apt/lists/*

ENV NVM_DIR=/home/vibeuser/.nvm
ARG NVM_VERSION=v0.40.3

# Non-root user for day-to-day work.
RUN useradd -ms /bin/bash vibeuser
# Pre-create the node_modules mountpoint as vibeuser.
# runmistral.sh mounts an anonymous volume over it to shadow the host's
# node_modules; Docker initializes a fresh volume with the content and
# ownership of the image path, so this makes the volume writable by vibeuser.
RUN mkdir -p /opt/myproj/node_modules && \
    chown -R vibeuser:vibeuser /opt/myproj

USER vibeuser
WORKDIR /home/vibeuser

RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash

# Node version pinned by the project (passed in by the build script).
ARG NODE_VERSION
ARG NPM_VERSION
RUN test -n "$NODE_VERSION" || (echo "NODE_VERSION build arg is required" && exit 1)
RUN test -n "$NPM_VERSION" || (echo "NPM_VERSION build arg is required" && exit 1)

RUN . "$NVM_DIR/nvm.sh" && \
    nvm install "$NODE_VERSION" && nvm alias default "$NODE_VERSION" && \
    ln -sfn "$(dirname "$(nvm which default)")" /home/vibeuser/.node-bin

RUN . "$NVM_DIR/nvm.sh" && npm install -g "npm@${NPM_VERSION}"

ENV PATH="/home/vibeuser/.node-bin:${PATH}"

# Verify installations.
RUN node --version && npm --version && git --version

CMD ["bash"]
