# Serverless Example App

Contains a `template.yaml` meant to be used with `aws` lambdas<br>
Inspect the files `handler.js`, `src/server/preRender.js` and `src/server/index.js`.

```bash
# Install
npm i

# Run development
npm run dev

# Run server in production (classic mode using docker or similar, not with serverless)
npm run serve

# Test serverless mode (this will generate the html and output it to the console)
npm run render
```

This app was built with [dev-toolkit](https://github.com/stoikerty/dev-toolkit) and could potentially help out with creating a similar example with [Next.js](https://github.com/zeit/next.js/) or [Razzle.js](https://github.com/jaredpalmer/razzle).

## Building and deploying the lambda

```bash
# Install dependencies and create the client build
cd lambda-app && npm i && npm run build && cd ..

# Create S3 Bucket
aws s3 mb s3://sam-dev-toolkit-lambda-app

# Convert the aws SAM template into cloudformation template
aws cloudformation package --s3-bucket sam-dev-toolkit-lambda-app --template-file template.yaml --output-template-file gen/template-generated.yaml

# deploy cloudformation template to lambda
aws cloudformation deploy --template-file gen/template-generated.yaml --stack-name sam-dev-toolkit-lambda-app --capabilities CAPABILITY_IAM --parameter-overrides IdentityNameParameter=prod
```
