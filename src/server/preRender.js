import React from 'react';
import path from 'path';
import expressHandlebars from 'express-handlebars';
import { renderToString } from 'react-dom/server';

const serverViews = path.resolve(process.cwd(), 'src/server/views');
const rootComponentPath = path.resolve(process.cwd(), 'src/client/RootComponent');
// We're using express-handlebars but you could use vanilla handlebars as well
const handlebarsInstance = expressHandlebars.create();

// This file is called individually via programmatic usage in `handler.js`
export default ({ assets, buildFolder }) => {
  // return a Promise to dev-toolkit
  return new Promise((resolve, reject) => {
    // Load Client App via RootComponent
    import(rootComponentPath)
      .then(module => {
        const RootComponent = module.default;
        if (process.env.TESTING) console.log('Rendering HTML...');

        // Here handlebars is used to generate the html without express and without webpack
        handlebarsInstance
          .render(path.join(serverViews, 'template.hbs'), {
            assets,
            renderedHtml: renderToString(<RootComponent />),
          })
          .then(html => {
            if (global.serverlessSettings) {
              if (process.env.TESTING) console.log('HTML genertated, finishing up...');
              const { event, context, callback } = global.serverlessSettings;

              const response = {
                statusCode: 200,
                headers: {
                  'Content-Type': 'text/html',
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                body: html,
              };

              if (process.env.TESTING)
                console.log('Sending the following response back:\n\n', response);
              resolve(() => callback(null, response));
            } else {
              // Generated html is written to html file in build folder
              fs.writeFile(
                path.join(buildFolder, 'index.html'),
                html,
                error => (error ? reject(error) : resolve())
              );
            }
          });
      })
      .catch(reject);
  });
};
