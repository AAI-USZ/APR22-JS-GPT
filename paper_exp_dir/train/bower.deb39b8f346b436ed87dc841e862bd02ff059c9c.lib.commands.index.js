var Q = require('q');
var Logger = require('bower-logger');


function commandFactory(id) {
if (process.env.STRICT_REQUIRE) {
require(id);
}

function command() {
var commandArgs = [].slice.call(arguments);

return withLogger(function (logger) {
commandArgs.unshift(logger);
return require(id).apply(undefined, commandArgs);
