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
