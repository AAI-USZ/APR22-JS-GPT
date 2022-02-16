var async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
moment = require('moment'),
rimraf = require('rimraf'),
util = require('../util'),
file = util.file,
log = util.log,
spawn = util.spawn;

var command = function(command, sub, options, callback){
spawn(command, sub, options,
function(data){
log.info(data);
},
function(data){
log.error(data);
},
function(code){
if (code == 0) callback();
else log.error(code);
}
);
};

exports.deploy = function(){
var target = process.cwd(),
deployDir = target + '/.deploy';

async.series([

function(next){
require('../config')(target, function(){
if (hexo.config.deploy) next();
else log.error('You have to use `%s` to setup deploy.', clc.bold('hexo setup_deploy'));
});
},

function(next){
file.empty(deployDir, next);
},

function(next){
var publicDir = hexo.public_dir;

fs.exists(publicDir, function(exist){
if (exist){
command('cp', ['-r', publicDir, deployDir], {}, next);
} else {
log.error('You have to use `%s` to generate files first.', clc.bold('hexo generate'));
}
});
},
function(next){
command('git', ['add', '.'], {cwd: deployDir}, next);
},
function(next){
var message = 'Site updated: ' + moment().format(hexo.config.date_format + ' ' + hexo.config.time_format);
log.info('Commiting: ' + message);
command('git', ['commit', '-m', message], {cwd: deployDir}, next);
},
function(next){
log.info('Pushing files to remote');
command('git', ['push', 'origin', hexo.config.deploy, '--force'], {cwd: deployDir}, next);
}
], function(){
log.success('Deploy complete.');
