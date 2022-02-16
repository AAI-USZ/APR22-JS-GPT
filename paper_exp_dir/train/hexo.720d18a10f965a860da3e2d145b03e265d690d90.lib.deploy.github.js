var fs = require('fs'),
clc = require('cli-color'),
path = require('path'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var deploy = function(){
var config = hexo.config,
deployDir = hexo.base_dir + '.deploy/',
publicDir = hexo.publicDir;

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
options: {cwd: deployDir},
exit: function(code){
if (code === 0) callback();
}
});
};

async.series([

function(next){
fs.exists(deployDir, function(exist){
if (exist) next();
else console.log('You have to use %s to setup deployment.', clc.bold('hexo setup_deploy'));
