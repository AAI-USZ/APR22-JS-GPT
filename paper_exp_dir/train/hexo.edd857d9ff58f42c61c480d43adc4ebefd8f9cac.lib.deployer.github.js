var extend = require('../extend'),
async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
sep = path.sep,
colors = require('colors'),
util = require('../util'),
file = util.file,
spawn = util.spawn,
config = hexo.config.deploy;

extend.deployer.register('github', function(args){
if (!config.repository || !config.branch){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
console.log([
'Example:',
'  deploy:',
'    type: github',
'    repository: <repository>',
'    branch: <branch>',
'',
'More info: http://zespia.tw/hexo/docs/deploy.html'
].join('\n') + '\n');
}

var deployDir = hexo.base_dir + '.deploy/',
publicDir = hexo.public_dir,
setup = args.setup;

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
options: {cwd: deployDir},
exit: function(code){
