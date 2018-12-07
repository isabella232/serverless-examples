import express from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import clearModule from 'clear-module';
import { isDev, usePreRender } from 'dev-toolkit/settings';

// Unlike the client app, the server app can only ever be run in Node.js
// we therefore have direct access to Node-specific things like `process`
const serverPort = process.env.SERVER_PORT || 3000;
const projectDirectory = process.cwd();
const serverViews = path.resolve(projectDirectory, 'src/server/views');
const clientFolder = path.resolve(projectDirectory, 'src/client');
const rootComponentPath = path.resolve(projectDirectory, 'src/client/RootComponent');

export default new class {
  constructor() {
    // Let dev-toolkit know about express by setting `this.express`,
    // this allows dev-toolkit to attach the dev-server middleware to webpack
    this.express = express();

    // Use Handlebars as the view engine in express
    this.express.engine('hbs', expressHandlebars.create().engine);
    this.express.set('views', serverViews).set('view engine', 'hbs');
  }

  // Ability to launch server later (allows dev-toolkit to bind webpack-middleware before start)
  start({ assets, buildFolder }) {
    if (isDev || !usePreRender) {
      // Render the template-file on any incoming requests
      this.express.use((req, res) => {
        // Remove Client App from cache (cheap server-side Hot-Reload)
        if (isDev) {
          clearModule(rootComponentPath);
          clearModule.match(new RegExp(`^${clientFolder}`, 'i'));
        }
        // Load newest version of Client App via RootComponent
        import(rootComponentPath).then(module => {
          const RootComponent = module.default;
          res.status(200).render('template', {
            assets,
            renderedHtml: renderToString(<RootComponent />),
          });
        });
      });
    } else {
      // Make assets in build folder available to the client.
      this.express.use(express.static(buildFolder));
    }

    // Run the express server by listening on the specified port
    this.serverInstance = this.express.listen(serverPort, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is listening on port ${serverPort}`);
    });
  }
}();
