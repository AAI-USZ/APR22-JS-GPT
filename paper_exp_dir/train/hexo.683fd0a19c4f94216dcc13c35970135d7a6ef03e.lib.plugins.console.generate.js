'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');
var inherits = require('util').inherits;
var crypto = require('crypto');
var Stream = require('stream');
var Transform = Stream.Transform;

function generateConsole(args){

var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
var self = this;
var start = process.hrtime();
var Cache = this.model('Cache');

function generateFile(path){
if (!route.isModified(path)) return Promise.resolve(false);

var dest = pathFn.join(publicDir, path);

return checkShasum(path).then(function(data){
if (!data) return false;

return fs.ensureWriteStream(dest).then(function(stream){


return pipeStream(route.get(path), stream);
}).then(function(){
log.info('Generated: %s', chalk.magenta(path));
return true;
});
});
}

function checkShasum(path){
var data = route.get(path);
var id = 'public/' + path;
var stream = new ShasumStream();

return pipeStream(data, stream).then(function(){
var shasum = stream.getShasum();
var cache = Cache.findById(id);

if (cache && cache.shasum === shasum) return;

if (!cache) cache = Cache.new({_id: id});
cache.shasum = shasum;
cache.modified = Date.now();

return cache.save().thenReturn(stream);
});
}

function deleteFile(path){
var dest = pathFn.join(publicDir, path);

return fs.unlink(dest).then(function(){
