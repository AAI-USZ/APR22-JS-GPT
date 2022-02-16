var path = require('path'),
async = require('async'),
moment = require('moment'),
fs = require('graceful-fs'),
sprintf = require('sprintf-js').sprintf,
HexoError = require('../../error'),
util = require('../../util'),
file = util.file2;

module.exports = function(args, callback){
var target = hexo.base_dir,
coreDir = hexo.core_dir,
log = hexo.log;

if (args._[0]) target = path.resolve(target, args._[0]);

async.auto({

check: function(next){
fs.exists(path.join(target, '_config.yml'), function(exist){
if (exist){
log.w('This folder has been already initialized.');
return callback();
}

next();
});
},

theme: ['check', function(next){
log.i('Copying theme data...');

file.copyDir(path.join(coreDir, 'assets', 'themes', 'light'), path.join(target, 'themes/light'), function(err){
if (err) return callback(HexoError.wrap(err, 'Theme copy failed'));

log.d('Theme data copied');
next();
});
}],

create_folders: ['check', function(next){
var folders = [
'source/_drafts',
'scripts'
];

async.each(folders, function(folder, next){
log.i('Creating folder: ' + folder);

file.mkdirs(path.join(target, folder), function(err){
if (err) return callback(HexoError.wrap(err, 'Folder create failed: ' + folder));

log.d('Folder created: ' + folder);
next();
})
}, next);
}],

copy: ['check', function(next){
var files = [
'_config.yml',
'scaffolds/draft.md',
'scaffolds/page.md',
'scaffolds/photo.md',
'scaffolds/post.md'
];

async.each(files, function(item, next){
log.i('Copying file: ' + item);

file.copyFile(path.join(coreDir, 'assets', 'init', item), path.join(target, item), function(err){
