#!/bin/bash

# Fail on errors
set -e

# ========== Configuration ==========
TEMPLATE_PATH="./docker-compose.yml-template"  # Template file path
ENV_PATH="../.env"                             # Path to .env file
OUTPUT_PATH="./docker-compose.yml"            # Output docker-compose file

# ========== Helper Functions ==========

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

# Checks if a value contains special characters that may require quoting
needs_quoting() {
  local value="$1"
  [[ "$value" =~ [/:@.\-\ \#\$\&\?\=\%\+] ]] && return 0 || return 1
}

# Adds single quotes to a value if needed
encapsulate_value() {
  local value="$1"
  if [[ "$value" =~ ^\".*\"$ || "$value" =~ ^\'.*\'$ ]]; then
    # Already quoted, return as is
    echo "$value"
  elif needs_quoting "$value"; then
    # Add single quotes if special characters are found
    echo "'$value'"
  else
    # Return unquoted value if no special characters are found
    echo "$value"
  fi
}

# Parses a .env file and loads key-value pairs into an associative array
declare -A ENV_VARS
parse_env_file() {
  if [[ ! -f $ENV_PATH ]]; then
    log "Error: .env file not found at $ENV_PATH" "ERROR"
    exit 1
  fi

  while IFS='=' read -r key value || [[ -n "$key" ]]; do
    key=$(echo "$key" | xargs)   # Trim whitespace
    value=$(echo "$value" | xargs) # Trim whitespace
    # Skip comments, empty lines
    [[ -z "$key" || "$key" == \#* ]] && continue

    # Remove surrounding single or double quotes from the value
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"

    # Quote the value if necessary
    ENV_VARS[$key]="$(encapsulate_value "$value")"
  done < "$ENV_PATH"
  log "- Parsed 10 environment variables" "SUCCESS"
}

# Replaces placeholders in the template with values from ENV_VARS
replace_variables() {
  if [[ ! -f "$TEMPLATE_PATH" ]]; then
    log "Error: Template file not found at $TEMPLATE_PATH" "ERROR"
    exit 1
  fi

  # Read the template content
  local content
  content=$(cat "$TEMPLATE_PATH")

  # Replace placeholders with values in the template
  for key in "${!ENV_VARS[@]}"; do
    content="${content//\$$key/${ENV_VARS[$key]}}"
  done

  # Write the modified content to the output file
  echo "$content" > "$OUTPUT_PATH"
  log "- Generated Docker/$(basename $OUTPUT_PATH) successfully!" "SUCCESS"
}

# ========== Main Logic ==========

generate_docker_compose() {
  log "Generating Docker/docker-compose.yml:"

  # Step 1: Parse the .env file
  parse_env_file

  # Step 2: Replace variables in the template
  replace_variables
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  generate_docker_compose
fi
