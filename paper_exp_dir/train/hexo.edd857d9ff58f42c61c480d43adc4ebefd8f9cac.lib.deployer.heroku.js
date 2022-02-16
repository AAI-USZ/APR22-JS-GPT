var extend = require('../extend'),
async = require('async'),
fs = require('graceful-fs'),
colors = require('colors'),
_ = require('underscore'),
util = require('../util'),
file = util.file,
spawn = util.spawn,
config = hexo.config.deploy;

extend.deployer.register('heroku', function(args){
if (!config.repository){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
console.log([
'Example:',
'  deploy:',
'    type: heroku',
'    repository: <repository>',
'',
'More info: http://zespia.tw/hexo/docs/deploy.html'
].join('\n') + '\n');
}

var baseDir = hexo.base_dir,
setup = args.setup;

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
exit: function(code){
if (code === 0) callback();
