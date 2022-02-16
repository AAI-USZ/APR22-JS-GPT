var EventEmitter = require('events').EventEmitter,
path = require('path'),
util = require('../util'),
Router = require('./router'),
version = require('../../package.json').version,
domain;

try {
domain = require('domain');
} catch (err){}
