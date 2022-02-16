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
