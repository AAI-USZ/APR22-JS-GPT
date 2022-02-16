var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2;


var rRepo = /(:|\/)([^\/]+)\/([^\/]+)\.git\/?$/;

var run = function(command, args, callback){
var cp = spawn(command, args, {cwd: deployDir});

cp.stdout.on('data', function(data){
process.stdout.write(data);
});

cp.stderr.on('data', function(data){
