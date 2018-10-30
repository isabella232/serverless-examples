# Serverless Example App

Contains a `.yaml` meant to be used with [`serverless` Framework](https://serverless.com/).
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
