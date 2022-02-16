var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');

function generateConsole(args){
var watch = args.w || args.watch;
var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
var self = this;
var start = process.hrtime();

function generateFile(path){
var data = route.get(path);
var dest = pathFn.join(publicDir, path);
var start = process.hrtime();


return ensureWriteStream(dest).then(function(stream){
return pipeStream(data, stream);
}).then(function(){
var interval = prettyHrtime(process.hrtime(start));
log.info('Generated in %s: %s', chalk.cyan(interval), chalk.magenta(path));
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

return Promise.each(deleted, deleteFile);
}

function watchFiles(){

route.on('update', function(path){
var modified = route.isModified(path);
if (!modified) return;

generateFile(path);
});

route.on('delete', deleteFile);
}

function deploy(){
return self.call('deploy');
}

if (watch){
log.info('Watching for file changes. Press Ctrl+C to stop.');
watchFiles();
return this.watch();
}

return this.load().then(function(){
var interval = prettyHrtime(process.hrtime(start));
log.info('Files loaded in %s', chalk.cyan(interval));


