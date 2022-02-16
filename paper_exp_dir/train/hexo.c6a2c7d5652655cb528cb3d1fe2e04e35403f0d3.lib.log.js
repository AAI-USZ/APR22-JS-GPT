var term = require('term'),
format = require('util').format,
_ = require('lodash'),
moment = require('moment'),
fs = require('graceful-fs'),
EventEmitter = require('events').EventEmitter;


var rTrim = new RegExp('\x1b(?:\\[(?:\\d+[ABCDEFGJKSTm]|\\d+;\\d+[Hfm]|' +
'\\d+;\\d+;\\d+m|6n|s|u|\\?25[lh])|\\w)', 'g');

