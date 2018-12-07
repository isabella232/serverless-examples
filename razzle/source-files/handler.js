"use strict";
const path = require("path");

// For now we set this to automatically run in production-mode
process.env.NODE_ENV = "production";

// import the file that references react-components and how to render the template
const preRender = require(path.resolve(process.cwd(), "build/server")).default;

// Step 2. let the render method use the previously imported files when needed
exports.render = (event, context, callback) =>
  preRender({ event, context, callback });

if (process.env.TESTING) exports.render("", "", console.log);
