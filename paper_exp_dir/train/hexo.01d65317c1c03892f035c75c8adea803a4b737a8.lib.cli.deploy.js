var async = require('async'),
clc = require('cli-color'),
fs = require('fs'),
moment = require('moment'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var command = function(command, sub, options, callback){
spawn(command, sub, options,
function(data){
console.log(data);
},
function(data){
console.log(data);
},
function(code){
if (code == 0) callback();
else console.log(code);
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
else console.log('You have to use `%s` to setup deploy.', clc.bold('hexo setup_deploy'));
});
},

function(next){
file.empty(deployDir, next);
},

function(next){
var publicDir = hexo.public_dir;

fs.exists(publicDir, function(exist){
if (exist){
file.dir(publicDir, function(files){
async.forEach(files, function(item, next){
var dirs = item.split('/');

for (var i=0, len=dirs.length; i<len; i++){
if (dirs[i].substring(0, 1) === '.'){
return next();
}
}

file.copy(publicDir + item, deployDir + '/' + item, next);
});
});
} else {
console.log('You have to use `%s` to generate files first.', clc.bold('hexo generate'));
}
});
},
function(next){
command('git', ['add', '.'], {cwd: deployDir}, next);
},
function(next){
var message = 'Site updated: ' + moment().format(hexo.config.date_format + ' ' + hexo.config.time_format);
console.log('Commiting: ' + message);
command('git', ['commit', '-m', message], {cwd: deployDir}, next);
},
function(next){
console.log('Pushing files to remote');
command('git', ['push', 'origin', hexo.config.deploy, '--force'], {cwd: deployDir}, next);
}
], function(){
console.log('Deploy complete.');
});
};

exports.setup = function(args){
var repo = args[0],
target = process.cwd(),
deployDir = target + '/.deploy';

if (repo === undefined) return false;

if (args[1]){
var branch = args[1];
} else {
var regex = repo.match(/^(https?:\/\/|git(@|:\/\/))?([^\/]+)/);

if (regex && regex[3].match(/github\.com/)){
var branch = repo.match(/\/[a-z0-9]+\.github\.com/) ? 'master' : 'gh-pages';
} else {
var branch = 'master';
}
}

async.series([

