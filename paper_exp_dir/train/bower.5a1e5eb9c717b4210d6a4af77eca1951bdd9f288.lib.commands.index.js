var Q = require('q');
var Logger = require('bower-logger');
var config = require('../config');
var cli = require('../util/cli');


function commandFactory(id) {
if (process.env.STRICT_REQUIRE) {
require(id);
}

function command() {
var commandArgs = [].slice.call(arguments);

