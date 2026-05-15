#!/bin/bash

# Exit on errors
set -e

# ========== Configuration ==========
DOCKER_DIR="$(dirname "$(readlink -f "$0")")"
PROJECT_ROOT="$(realpath "$DOCKER_DIR/..")"
BUILD_DIR="$DOCKER_DIR/build"
NECESSARY_DIR_ROOT="/opt/lmtt"
NECESSARY_DIR_ROOT_APP="$NECESSARY_DIR_ROOT/app"
NECESSARY_DIR_ROOT_DB="$NECESSARY_DIR_ROOT/db"
NECESSARY_DIR_APP_LOG="$NECESSARY_DIR_ROOT_APP/logs"
NECESSARY_DIR_DB_LOG="$NECESSARY_DIR_ROOT_DB/logs"
NECESSARY_DIR_DB_DATA="$NECESSARY_DIR_ROOT_DB/data"
ENV_FILE="$PROJECT_ROOT/.env"
COMPOSE_TEMPLATE="$DOCKER_DIR/docker-compose.yml-template"
OUTPUT_COMPOSE="$DOCKER_DIR/docker-compose.yml"
REQUIRED_FILES=(
  # App files
  "$PROJECT_ROOT/package.json"
  "$PROJECT_ROOT/package-lock.json"
  "$PROJECT_ROOT/schedule-conf.json"
  "$PROJECT_ROOT/src"
  "$PROJECT_ROOT/typedoc.json"
  "$PROJECT_ROOT/tsconfig.json"
  "$PROJECT_ROOT/tsconfig.build.json"
  "$PROJECT_ROOT/nest-cli.json"
  # Docker files
  "$DOCKER_DIR/Dockerfile-lmtt-app"
  "$DOCKER_DIR/docker-compose.yml"
  "$DOCKER_DIR/mongod.conf"
)

# ========== Functions ==========

# Logs messages with timestamps
log() {
  local message="$1"
  local type="${2:-INFO}"
  local timestamp
  timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  local emoji
  case "$type" in
    ERROR) emoji="❌";;
    SUCCESS) emoji="✅";;
    *) emoji="📝";;
  esac
  echo "$emoji [$timestamp] $message"
}

# Checks whether podman compose or docker-compose is available
check_compose_tool() {
  if command -v podman &>/dev/null; then
    echo "podman compose"
  elif command -v docker-compose &>/dev/null; then
    echo "docker-compose"
  else
    log "Neither podman nor docker-compose is installed. Please install one to proceed." "ERROR"
    exit 1
  fi
}

# Parses the .env file into a bash-associative array
parse_env_file() {
  declare -gA ENV_VARS
  log "Parsing .env file"
  while IFS='=' read -r key value; do
    [[ "$key" =~ ^#.*$ ]] && continue  # Skip comments
    [[ -z "$key" ]] && continue        # Skip empty lines
    value="$(sed -e 's/^ *//' -e 's/ *$//' <<<"$value")"  # Trim spaces
    value="${value%\"}"  # Remove quotes
    value="${value#\"}"
    ENV_VARS["$key"]="$value"
  done < "$ENV_FILE"
  log "Parsed ${#ENV_VARS[@]} environment variables" "SUCCESS"
}

# Replaces variables in the template and generates docker-compose.yml
generate_docker_compose() {
  local content
  content=$(<"$COMPOSE_TEMPLATE")

  for key in "${!ENV_VARS[@]}"; do
    content="${content//\$$key/${ENV_VARS[$key]}}"
  done

  echo "$content" > "$OUTPUT_COMPOSE"
  log "Generated Docker/docker-compose.yml successfully" "SUCCESS"
}

# Create necessary directories
prepare_necessary_dir() {
  log "Preparing necessary directories"
  mkdir -p "$NECESSARY_DIR_APP_LOG" "$NECESSARY_DIR_DB_LOG" "$NECESSARY_DIR_DB_DATA"
  log "- Dir Created: $NECESSARY_DIR_APP_LOG"
  log "- Dir Created: $NECESSARY_DIR_DB_LOG"
  log "- Dir Created: $NECESSARY_DIR_DB_DATA"
}

# Creates build directory and copies necessary files
prepare_build_dir() {
  log "Preparing build directory:"
  rm -rf "$BUILD_DIR"
  mkdir -p "$BUILD_DIR"

  for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
      dest="$BUILD_DIR/$(basename "$file")"
      cp -r "$file" "$dest"
      log "- Copied: $(basename "$file") -> Docker/build/$(basename "$file")"
    else
      log "Error: Required file $file not found." "ERROR"
      exit 1
    fi
  done
}

# Deploys containers using podman-compose or docker-compose
deploy_containers() {
  local compose_tool
  compose_tool=$(check_compose_tool)

  log "Deploying containers using $compose_tool:"

  (
    cd "$BUILD_DIR" || exit

    # Stop any running containers
    log "- Stopping existing containers"
    $compose_tool down || true

    # Build the containers
    log "- Building containers"
    $compose_tool build

    # Start the containers in detached mode
    log "- Starting containers"
    $compose_tool up -d
  )
  log "- Containers deployed successfully" "SUCCESS"
}

# Stops and removes containers
stop_containers() {
  local compose_tool
  compose_tool=$(check_compose_tool)

  echo "$comopse_tool"

  log "Stopping containers with $compose_tool:"
  (
    $compose_tool down
  )
  log "Containers stopped successfully" "SUCCESS"
}

# Shows container status
show_status() {
  log "Showing container status"
  podman ps -a || docker ps -a
}

# Cleans up the build directory
cleanup() {
  rm -rf "$BUILD_DIR"
  log "Build directory cleaned up" "SUCCESS"
}

# ========== Script Execution ==========

case "$1" in
  "deploy")
    parse_env_file
    generate_docker_compose
    prepare_build_dir
    prepare_necessary_dir
    deploy_containers
    # cleanup
    ;;
  "stop")
    stop_containers
    ;;
  "status")
    show_status
    ;;
  *)
    echo "Usage: $0 {deploy|stop|status}"
    echo "deploy - Generate docker-compose.yml, prepare build, and deploy containers"
    echo "stop   - Stop and remove all containers"
    echo "status - Show the status of running containers"
    exit 1
    ;;
esac
