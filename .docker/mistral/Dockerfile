ARG BASE_IMAGE=qec-agent-base:latest
FROM ${BASE_IMAGE}

# The installer puts 'vibe' in ~/.local/bin and fails if that isn't on PATH.
ENV PATH="/home/vibeuser/.local/bin:${PATH}"

# Run the official Mistral CLI installation script.
RUN curl -LsSf https://mistral.ai/vibe/install.sh | bash

# Verify installations.
RUN vibe --version

CMD ["vibe"]
