var Q = require('q');
var Logger = require('bower-logger');
var config = require('../config');


function commandFactory(id) {
function runApi() {
var command = require(id);
var commandArgs = [].slice.call(arguments);

return withLogger(function (logger) {
commandArgs.unshift(logger);

return command.apply(undefined, commandArgs);
