var extend = require('../../extend'),
async = require('async'),
fs = require('graceful-fs'),
colors = require('colors'),
util = require('../../util'),
file = util.file,
spawn = util.spawn,
config = hexo.config.deploy;

extend.deployer.register('github', function(args){
if (!config.repository || !config.branch){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
return console.log([
