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
fs.exists(deployDir, function(exist){
if (exist) next();
else console.log('You have to use `%s` to setup deploy.', clc.bold('hexo setup_deploy'));
});
},

function(next){
file.empty(deployDir, next);
},

function(next){
