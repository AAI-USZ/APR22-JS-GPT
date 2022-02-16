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

package: function(next){
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

file.write(target + '/package.json', JSON.stringify(pkg, null, '  ') + '\n', next);
},

gitignore: function(next){
file.write(target + '/.gitignore', '.DS_Store\nnode_modules', next);
},

config: function(next){
var config = [
'# Basic',
'title: Hexo',
'subtitle: Node.js blog framework',
'description:',
'url: http://yoursite.com',
'author: John Doe',
'email:',
'language:',
'',
'# Permalink',
'root: /',
'permalink: :year/:month/:day/:title/',
'tag_dir: tags',
'archive_dir: archives',
'category_dir: posts',
'',
'# Archives',
'archive: 2',
'category: 2',
'tag: 2',
'',
'# Server',
'port: 4000',
'logger: false',
'logger_format:',
'',
'# Date / Time format',
