var Mocha = require('mocha'),
path = require('path'),
fs = require('graceful-fs'),
argv = require('optimist').argv;

var mocha = new Mocha({
reporter: argv.reporter || 'dot'
});

var rFilename = /\.test\.js$/;

fs.readdir(__dirname, function(err, files){
