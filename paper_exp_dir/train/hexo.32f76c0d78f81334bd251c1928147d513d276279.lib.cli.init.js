var path = require('path'),
async = require('async'),
colors = require('colors'),
moment = require('moment'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn,
coreDir = hexo.core_dir;

extend.console.register('init', 'Initialize', function(args){
var target = process.cwd();

if (args._[0]) target = path.resolve(target, args._[0]);

console.log('Initializing.');

async.auto({

theme: function(next){
spawn({
command: 'git',
args: ['clone', 'git://github.com/tommy351/hexo-theme-light.git', target + '/themes/light'],
exit: function(code){
if (code === 0) return next();

console.log('Failed to download theme with Git. Install local files instead.');

var themeDir = coreDir + 'files/themes/light/';

file.dir(themeDir, function(files){
