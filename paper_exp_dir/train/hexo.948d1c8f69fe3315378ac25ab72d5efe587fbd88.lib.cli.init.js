var path = require('path'),
async = require('async'),
util = require('../util'),
log = util.log,
file = util.file,
spawn = util.spawn;

module.exports = function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

async.parallel([
function(next){
file.mkdir(target + '/plugins', next);
},
function(next){
file.mkdir(target + '/themes', function(){
spawn('git', ['clone', 'git://github.com/tommy351/hexo-theme-light.git', target + '/themes/light'], {},
function(data){
log.info(data);
},
function(data){
log.error(data);
},
function(code){
if (code == 0) next();
else log.error(code);
}
);
});
},
function(next){
file.mkdir(target + '/source', function(){
async.parallel([
function(next){
file.mkdir(target + '/source/_posts', next);
},
function(next){
file.mkdir(target + '/source/_stash', next);
}
], next);
});
},
function(next){
var config = [
'# Basic',
'title: Hexo',
'subtitle: Fastest blogging framework',
'description:',
'url: http://yoursite.com',
'author: John Doe',
'email:',
'',
'# Permalink',
'root: /',
'permalink: :year/:month/:day/:title',
'tag_dir: tags',
'archive_dir: archives',
'category: posts',
'',
'# Server',
'port: 4000',
'',
'# Date / Time format',
