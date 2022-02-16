var should = require('chai').should(),
fs = require('graceful-fs'),
async = require('async'),
pathFn = require('path'),
file = require('../../../lib/util/file2');

var check = function(args, results, callback){
args.push(function(err, path, content){
if (err) return callback(err);

async.parallel([

function(next){
