var path = require('path'),
async = require('async'),
clc = require('cli-color'),
moment = require('moment'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

extend.console.register('init', 'Initialize', function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

console.log('Initializing.');

async.auto({

theme: function(next){
file.mkdir(target + '/themes', function(){
spawn({
command: 'git',
args: ['clone', 'git://github.com/tommy351/hexo-theme-light.git', target + '/themes/light'],
exit: function(code){
if (code === 0) next();
}
});
});
},

source: function(next){
file.mkdir(target + '/source', next);
},
post_folder: ['source', function(next){
file.mkdir(target + '/source/_posts', next);
}],
draft_folder: ['source', function(next){
file.mkdir(target + '/source/_drafts', next);
}],
script_folder: function(next){
file.mkdir(target + '/scripts', next);
},

package: function(next){
var pkg = {
name: 'hexo',
version: '0.0.1',
private: true,
engines: {
