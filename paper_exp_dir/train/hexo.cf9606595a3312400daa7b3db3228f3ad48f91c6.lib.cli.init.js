var path = require('path'),
async = require('async'),
colors = require('colors'),
moment = require('moment'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
coreDir = hexo.core_dir;

extend.console.register('init', 'Initialize', {init: true}, function(args){
var target = process.cwd();

if (args._[0]) target = path.resolve(target, args._[0]);

console.log('Initializing.');

async.auto({

theme: function(next){
var themeDir = coreDir + 'files/themes/light/';

file.dir(themeDir, function(files){
async.forEach(files, function(item, next){
file.copy(themeDir + item, target + '/themes/light/' + item, next);
}, next);
});
},

source: function(next){
file.mkdir(target + '/source', next);
},
draft_folder: ['source', function(next){
file.mkdir(target + '/source/_drafts', next);
}],
script_folder: function(next){
file.mkdir(target + '/scripts', next);
},
public_folder: function(next){
file.mkdir(target + '/public', next);
},

copy: function(next){
var files = ['package.json', '.gitignore', '_config.yml', 'scaffolds/post.md', 'scaffolds/page.md', 'scaffolds/photo.md'];
