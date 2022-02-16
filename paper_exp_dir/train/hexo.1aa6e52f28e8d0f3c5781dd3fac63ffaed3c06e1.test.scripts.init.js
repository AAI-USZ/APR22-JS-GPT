var pathFn = require('path'),
async = require('async'),
should = require('chai').should(),
spawn = require('child_process').spawn,
file = require('../../lib/util/file2');

var compareFile = function(a, b, callback){
async.parallel([
function(next){
file.readFile(a, {encoding: null}, next);
},
function(next){
