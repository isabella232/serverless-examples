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

STACK_NAME='lambda-serverless-examples-dev-toolkit'

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
  cp -R ../source-files/src ./lambda-app/src
  cp ../source-files/.babelrc ./lambda-app/.babelrc
  cp ../source-files/dev-toolkit.config.js ./lambda-app/dev-toolkit.config.js
  cp ../source-files/handler.js ./lambda-app/handler.js
  cp ../source-files/package.json ./lambda-app/package.json

  cd ./lambda-app
  log "Installing production packages with npm"
  npm i --production

  log "Creating build files"
  npm run build
  cd ..

  log "Precompiling source files"
  cd ./lambda-app
  npm i -g @babel/core @babel/cli
  mv src raw_src
  NODE_ENV=production babel raw_src --out-dir src --copy-files
  rm -rf raw_src
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


