var path = require('path'),
async = require('async'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

module.exports = function(args){
var target = process.cwd();

if (args[0]) target = path.resolve(target, args[0]);

async.parallel([
function(next){
file.mkdir(target + '/themes', function(){
spawn('git', ['clone', 'git://github.com/tommy351/hexo-theme-light.git', target + '/themes/light'], {},
function(data){
console.log(data);
},
function(data){
console.log(data);
},
function(code){
if (code == 0) next();
else console.log(code);
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
file.mkdir(target + '/source/_drafts', next);
}
], next);
});
},
function(next){
var pkg = {
private: true,
dependencies: {}
};

file.write(target + '/package.json', JSON.stringify(pkg, null, '  ') + '\n', next);
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
'permalink: :year/:month/:day/:title/',
'tag_dir: tags',
'archive_dir: archives',
'category_dir: posts',
'',
'# Archives',
'# advanced: Paginate result',
'# simple: Display result in same page',
'# false: Disable',
'archive: advanced',
'category: advanced',
'tag: advanced',
'',
'# Server',
