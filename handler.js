'use strict';
const path = require('path');

module.exports.render = (event, context, callback) => {
  if (process.env.TESTING) console.log('Pre-rendering using `dev-toolkit` & `serverless`');
  global.serverlessSettings = {
    event: event,
    context: context,
    callback: callback,
  };

  // Example of programmatic usage of dev-toolkit with a serverless-type application
  require('dev-toolkit').default({
    command: 'preRender',
    options: {
      preRenderEntryPoint: path.resolve(process.cwd(), 'src/server/preRender'),
      silent: true,
    },
  });
};

// Event Gateway  Event API  listening on: http://localhost:4000
// Event Gateway  Config API listening on: http://localhost:4001
// Serverless     Emulator   listening on: http://localhost:4002

if (process.env.TESTING) module.exports.render();
