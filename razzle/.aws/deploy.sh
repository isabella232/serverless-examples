#!/bin/sh

# Usage
# -----
#   Run the full deploy script, recreating folder, installing and building files
#   ./deploy.sh
#
#   Only package and deploy files
#   ./deploy.sh dry -> Will run the full deploy script
#

# Configuration:

STACK_NAME='lambda-serverless-examples-razzle'

# ---

NOCOLOR='\033[0m'
BLUE='\033[0;34m'
GREY='\033[0;37m'
ICON='\033[0;34m[λ]\033[0;37m'
log ()
{
  echo "\n${ICON} $1${NOCOLOR}"
}

echo "\n${BLUE}[  Starting Deploy  ]${NOCOLOR}"

if [ "$1" != "dry" ]; then
  log "Copying files"
  rm -rf ./lambda-app
  mkdir ./lambda-app 2> /dev/null
  cp ../source-files/handler.js ./lambda-app/handler.js
  cp ../source-files/package.json ./lambda-app/package.json
  cp -R ../source-files/src ./lambda-app/src
  cp -R ../source-files/public ./lambda-app/public

  cd ./lambda-app
  log "Installing production packages with npm"
  npm i --production

  log "Creating build files"
  npm run build

  cd ..
else
  log "(dry) Skip: Recreating lambda-app folder"
fi

log "Packaging and Uploading to S3"
mkdir gen 2> /dev/null
aws cloudformation package --s3-bucket $STACK_NAME --template-file lambda.yaml --output-template-file gen/lambda.yaml

log "Deploying Stack"
aws cloudformation deploy --template-file gen/lambda.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM

echo "\n${BLUE}[  Script finished  ]${NOCOLOR}"


