var EventEmitter = require('events').EventEmitter,
fs = require('graceful-fs'),
moment = require('moment'),
path = require('path'),
util = require('util'),
colors = require('colors'),
os = require('os'),
Logger = require('./logger'),
Router = require('./router'),
Extend = require('./extend'),
version = require('../package.json').version,
env = process.env,
domain;

try {
domain = require('domain');
