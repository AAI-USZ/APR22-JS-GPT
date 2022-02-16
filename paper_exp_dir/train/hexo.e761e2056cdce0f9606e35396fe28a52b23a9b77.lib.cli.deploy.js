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
deployDir = target + '/.deploy',
deployOldDir = target + '/.deploy.old';

async.series([

function(next){
require('../config')(target, function(){
if (hexo.config.deploy) next();
else log.error('You have to use `%s` to setup deploy.', clc.bold('hexo setup_deploy'));
});
