#!/bin/bash -e

# Script to deploy running application from AWS.
# CodeDeploy App and Deployment Group should exist in AWS.

# Next variables should be passed in command line
# ENV

# Next variables should be set in .env file
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
# AWS_DEFAULT_REGION
# AWS_CODE_DEPLOY_APP_NAME
# AWS_CODE_DEPLOY_APP_FOLDER
# AWS_CODE_DEPLOY_BUCKET

# Examples:
# ENV=staging bash deploy-from-localhost.sh
# ENV=production bash deploy-from-localhost.sh

composer update

echo "Starting build..."

#creating release json file
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git show --format="%h" --no-patch)
AUTHOR=$(git config user.name)
DATE=$(date)
template='{"branch":"%s","commit":"%s","author":"%s","date":"%s"}'

json_string=$(printf "$template" "$BRANCH" "$COMMIT" "$AUTHOR" "$DATE")

echo "$json_string" > release.json

# get current dir
ROOT_DIR="$(dirname "$0")"
BUILD_DIR="$ROOT_DIR/build"

# set -a causes variables defined from now on to be automatically exported
set -a
# import configuration variables
source "$ROOT_DIR/.env.$ENV"
set +a

mkdir -p "$BUILD_DIR"

# -------------------------------------------------
# rename ENV files

# copy current .env file to temp
cp ".env" ".env.temp"

# use environment file
cp ".env.$ENV" ".env"

cd "public"

# copy current .env file to temp
cp ".htaccess" ".htaccess.temp"

# use environment file
cp ".htaccess.$ENV" ".htaccess"

# -------------------------------------------------
# replace app folder in files

cd ".."

# copy current .env file to temp
cp "appspec.yml" "appspec.yml.temp"
cp "deploy_hooks/config.sh" "deploy_hooks/config.sh.temp"

REPLACE_EXP="s/{AWS_CODE_DEPLOY_APP_FOLDER}/$AWS_CODE_DEPLOY_APP_FOLDER/g"
sed -i -e "$REPLACE_EXP" "appspec.yml"
sed -i -e "$REPLACE_EXP" "deploy_hooks/config.sh"

echo "Replaced pattern ($REPLACE_EXP) in files"

# replace app name in files
REPLACE_EXP="s/{AWS_CODE_DEPLOY_APP_NAME}/$AWS_CODE_DEPLOY_APP_NAME/g"
sed -i -e "$REPLACE_EXP" "public/.htaccess"

echo "Replaced pattern ($REPLACE_EXP) in files"

# -------------------------------------------------
# zip project

BUILD_DIR="build"
BUNDLE_NAME="$ENV.zip"
BUNDLE_PATH="$BUILD_DIR/$BUNDLE_NAME"

# create build folder if not exists
mkdir -p "$BUILD_DIR"

# zip current dir
zip -r "$BUNDLE_PATH" . -x\
    ./.git\*\
    ./db/\*\
    ./node_modules/\*\
    ./package-lock.json\*\
    ./composer.lock\*\
    ./bootstrap/cache/**\*\
    ./public/storage/**\*\
    ./storage/logs/**\*\


# -------------------------------------------------
# prepare deployment zip

NOW=$(date +"%Y-%m-%d_%H:%M:%S")
DG="${ENV^}" # Deployment Group name
DEST_BUNDLE_NAME="$AWS_CODE_DEPLOY_APP_FOLDER-$ENV-$NOW.zip"

# check for Deployment Group existence
echo "Checking $AWS_CODE_DEPLOY_APP_NAME app and Deployment Group $DG existence..."

DG_SEARCH_RESULTS="$(aws deploy get-deployment-group --application-name $AWS_CODE_DEPLOY_APP_NAME --deployment-group-name $DG --region $AWS_DEFAULT_REGION 2>&1)"

echo "$DG_SEARCH_RESULTS"

if [[ ("$DG_SEARCH_RESULTS" != *"No application found"*) && ("$DG_SEARCH_RESULTS" != *"No Deployment Group found"*) ]]; then

    echo "Uploading zip..."
    # upload to s3
    aws s3 cp --output "json" --region "$AWS_DEFAULT_REGION" "$BUNDLE_PATH" "s3://$AWS_CODE_DEPLOY_BUCKET/$DEST_BUNDLE_NAME"

    echo "Triggering deploy..."
    # trigger CodeDeploy
    aws deploy create-deployment \
      --application-name "$AWS_CODE_DEPLOY_APP_NAME" \
      --ignore-application-stop-failures \
      --deployment-group-name "$DG" \
      --region "$AWS_DEFAULT_REGION" \
      --description "Deployed from localhost" \
      --s3-location "bucket=$AWS_CODE_DEPLOY_BUCKET,bundleType=zip,key=$DEST_BUNDLE_NAME"
else
    echo "Skipping deploy... Done."
fi

# rename files back
mv "appspec.yml.temp" "appspec.yml"
mv "deploy_hooks/config.sh.temp" "deploy_hooks/config.sh"

mv ".env.temp" ".env"

rm -rf build

cd "public"

mv ".htaccess.temp" ".htaccess"
