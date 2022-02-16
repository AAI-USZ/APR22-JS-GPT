var Mocha = require('mocha'),
path = require('path'),
argv = require('optimist').argv;

var tests = [
'helper',
'i18n',
'log',
'router',
'tag'
];

var mocha = new Mocha({
reporter: argv.reporter || 'dot'
});
