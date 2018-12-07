import App from "./App";
import React from "react";
import { renderToString } from "react-dom/server";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

// This file is called individually via programmatic usage in `handler.js`
export default ({ event, context, callback }) => {
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  return new Promise((resolve, reject) => {
    const html = renderToString(<App />);

    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
      },
      body: `<!doctype html>
  <html lang="">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <title>Welcome to Razzle</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${
      assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ""
    }
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="${assets.client.js}" defer crossorigin></script>
  </body>
</html>`
    };

    callback(null, response);
    resolve();
  });
};
