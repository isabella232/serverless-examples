import React from 'react';
import path from 'path';
import expressHandlebars from 'express-handlebars';
import { renderToString } from 'react-dom/server';
import RootComponent from 'src/client/RootComponent';
import assets from 'src/../build/assets-manifest.json';

const serverViews = path.resolve(process.cwd(), 'src/server/views');
// We're using express-handlebars but you could use vanilla handlebars as well
const handlebarsInstance = expressHandlebars.create();

// This file is called individually via programmatic usage in `handler.js`
export default ({ event, context, callback }) => {
  return new Promise((resolve, reject) => {
    // Here handlebars is used to generate the html without express and without webpack
    handlebarsInstance
      .render(path.join(serverViews, 'template.hbs'), {
        assets,
        renderedHtml: renderToString(<RootComponent />),
      })
      .then(html => {
        const response = {
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          },
          body: html,
        };

        callback(null, response);
        resolve();
      });
  });
};
