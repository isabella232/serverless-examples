"use strict";
const React = require("react");
const renderToString = require("react-dom/server").renderToString;

console.log("Loading function");

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.render = (event, context, callback) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  callback(null, {
    statusCode: "200",
    body: renderToString(
      React.createElement("span", { className: "test-element" }, "Test Element")
    ),
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// Testing locally:
if (process.env.TESTING) exports.render("", "", console.log);
