#!/bin/bash

# get current dir
DIR="$(dirname "$0")"

# lowercase deployment group name to match environment
ENV="$(echo "$DEPLOYMENT_GROUP_NAME" | tr "[:upper:]" "[:lower:]")"

# path to config file
CONFIG_FILE="$DIR/../.env"

# import configuration variables
source "$CONFIG_FILE"

# replace http(s):// in domain
APP_DOMAIN="$(echo  "$APP_URL" | sed 's~http[s]*://~~g')"

# define app folder
APP_FOLDER="/var/www/html/$APP_SHORT_NAME"
