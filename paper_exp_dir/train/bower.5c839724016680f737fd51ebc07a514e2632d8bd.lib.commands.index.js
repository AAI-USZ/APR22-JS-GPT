var Q = require('q');
var Logger = require('bower-logger');


function commandFactory(id) {
function command() {
var commandArgs = [].slice.call(arguments);

return withLogger(function (logger) {
commandArgs.unshift(logger);
return require(id).apply(undefined, commandArgs);
});
}

function runFromArgv(argv) {
