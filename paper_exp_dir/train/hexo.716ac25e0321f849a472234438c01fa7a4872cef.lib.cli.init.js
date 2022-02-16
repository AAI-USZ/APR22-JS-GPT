var path = require('path'),
async = require('async'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

extend.console.register('init', 'Initialize', function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

async.parallel([
function(next){
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
function(next){
file.mkdir(target + '/source', function(){
async.parallel([
function(next){
file.mkdir(target + '/source/_posts', next);
},
function(next){
file.mkdir(target + '/source/_drafts', next);
}
], next);
});
},
function(next){
var pkg = {
name: 'hexo',
version: '0.0.1',
private: true,
engines: {
'node': '>0.6.0',
'npm': ">1.1.0"
},
dependencies: {}
};

