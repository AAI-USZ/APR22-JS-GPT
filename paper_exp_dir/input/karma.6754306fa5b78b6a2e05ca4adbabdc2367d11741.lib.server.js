var io = require('socket.io');
var net = require('net');

var cfg = require('./config');
var ws = require('./web-server');
var logger = require('./logger');
var browser = require('./browser');
var reporter = require('./reporter');
var events = require('./events');
var constant = require('./constants');
var watcher = require('./watcher');
var preprocessor = require('./preprocessor');
var Launcher = require('./launcher').Launcher;
var FileList = require('./file-list').List;
var helper = require('./helper');


exports.start = function(cliOptions, done) {
var config = cfg.parseConfig(cliOptions.configFile, cliOptions);


if (! helper.isFunction(done)) {
done = process.exit;
}

