'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');

function generateConsole(args){

var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
var self = this;
var start = process.hrtime();

function generateFile(path){
var data = route.get(path);
var dest = pathFn.join(publicDir, path);


return fs.ensureWriteStream(dest).then(function(stream){
return pipeStream(data, stream);
}).then(function(){
log.info('Generated: %s', chalk.magenta(path));
});
}

function deleteFile(path){
var dest = pathFn.join(publicDir, path);

return fs.unlink(dest).then(function(){
log.info('Deleted: %s', chalk.magenta(path));
}, function(err){

if (err.cause.code !== 'ENOENT') throw err;
});
}

function generateFiles(files){
var list = route.list();

return Promise.filter(list, function(path){

var modified = route.isModified(path);
return modified || !~files.indexOf(path);
}).map(generateFile).then(function(arr){

return arr.length;
});
}

function cleanFiles(files){
var deleted = _.difference(files, route.list());

return Promise.map(deleted, deleteFile);
}

function firstGenerate(){

var interval = prettyHrtime(process.hrtime(start));
log.info('Files loaded in %s', chalk.cyan(interval));


start = process.hrtime();


return fs.exists(publicDir).then(function(exist){
if (!exist){

return fs.mkdirs(publicDir);
}


return fs.listDir(publicDir).map(function(path){
return path.replace(/\\/g, '/');
});
}).then(function(files){
files = files || [];

return Promise.all([
generateFiles(files),
cleanFiles(files)
]);
}).spread(function(count){
var interval = prettyHrtime(process.hrtime(start));
log.info('%d files generatd in %s', count, chalk.cyan(interval));
});
}

if (args.w || args.watch){
return this.watch().then(firstGenerate).then(function(){
log.info('Hexo is watching for file changes. Press Ctrl+C to exit.');


route.on('update', function(path){
var modified = route.isModified(path);
if (!modified) return;

generateFile(path);
}).on('remove', function(path){
deleteFile(path);
});
});
}

return this.load().then(firstGenerate).then(function(){
if (args.d || args.deploy){
return self.call('deploy', args);
}
});
