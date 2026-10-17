#!/usr/bin/env bash

set -e

script_dir="$(realpath "$(dirname "${BASH_SOURCE[0]}")")"
repo_root="$(realpath "${script_dir}/../..")"

docker build \
  --build-arg NODE_VERSION="$(cat "${repo_root}/.nvmrc")" \
  --build-arg NPM_VERSION="$(npm --version)" \
  -t qec-agent-base \
  -f "${repo_root}/.docker/agent-base/Dockerfile" \
  "${repo_root}/.docker/agent-base"
docker build -t qec-mistral -f "${script_dir}/Dockerfile" "${script_dir}"

docker run --rm -it \
  -e MISTRAL_API_KEY="${MISTRAL_API_KEY}" \
  -e GIT_AUTHOR_NAME="$(git config user.name) (via Mistral)" \
  -e GIT_AUTHOR_EMAIL="$(git config user.email)" \
  -e GIT_COMMITTER_NAME="$(git config user.name) (via Mistral)" \
  -e GIT_COMMITTER_EMAIL="$(git config user.email)" \
  -v "${repo_root}":/opt/myproj \
  -v /dev/null:/opt/myproj/.env \
  -v /opt/myproj/node_modules \
  -v "${script_dir}/.vibe":/home/vibeuser/.vibe \
  -w /opt/myproj \
  --entrypoint bash qec-mistral
