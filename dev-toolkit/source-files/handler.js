'use strict';
const path = require('path');
// For now we set this to automatically run in production-mode
process.env.NODE_ENV = 'production';
// Specify a writable directory for babel since lambdas are read-only
process.env.BABEL_CACHE_PATH = '/tmp/babel-cache.json';

// Step 1. import everything that the lambda should know ahead of time

// bootstrap dev-toolkit settings and environment, silence the output
require('dev-toolkit')({ command: 'bootstrap', options: { silent: true } });

// import the file that references react-components and how to render the template
const preRender = require(path.resolve(process.cwd(), 'src/server/preRender')).default;

// Step 2. let the render method use the previously imported files when needed
exports.render = (event, context, callback) => preRender({ event, context, callback });

if (process.env.TESTING) exports.render('', '', console.log);
