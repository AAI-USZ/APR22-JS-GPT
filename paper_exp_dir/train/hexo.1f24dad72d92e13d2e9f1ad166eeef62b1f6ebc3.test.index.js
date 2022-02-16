var Mocha = require('mocha'),
path = require('path'),
argv = require('optimist').argv;

var tests = [
'i18n',
'log',
'router',
'tag'
