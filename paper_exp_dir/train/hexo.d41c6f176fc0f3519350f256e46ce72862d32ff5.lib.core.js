var EventEmitter = require('events').EventEmitter,
path = require('path'),
Logger = require('./logger'),
Router = require('./router'),
Extend = require('./extend'),
util = require('./util'),
version = require('../package.json').version,
env = process.env,
domain;

try {
