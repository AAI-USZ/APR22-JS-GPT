var term = require('term'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../../extend'),
list = extend.deployer.list(),
util = require('../../util'),
spawn = util.spawn;

extend.console.register('deploy', 'Deploy', function(args){
var config = hexo.config.deploy;

if (!config || !config.type){
var help = '\nYou should configure deployment settings in ' + '_config.yml'.bold + ' first!\n\nType:\n';
help += '  ' + Object.keys(list).join(', ');
console.log(help + '\n\nMore info: http://zespia.tw/hexo/docs/deploy.html\n');
} else {
async.series([
function(next){
