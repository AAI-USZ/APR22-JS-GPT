var Q = require('q');
var Logger = require('bower-logger');


function lazyRequire(id) {
function command() {
var logger = new Logger();
var commandArgs = arguments;

Q.try(function () {
