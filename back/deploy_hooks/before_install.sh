#!/bin/bash

# import configuration variables
source "$(dirname "$0")/config.sh"

# remove old files
rm -rf "$APP_FOLDER"
