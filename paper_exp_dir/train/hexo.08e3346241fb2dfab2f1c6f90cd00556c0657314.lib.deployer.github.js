var fs = require('fs'),
clc = require('cli-color'),
path = require('path'),
async = require('async'),
extend = require('../extend'),
util = require('../util'),
file = util.file,
spawn = util.spawn;

var displayHelp = function(){
var help = [
'',
'You should configure deployment settings in ' + clc.bold('_config.yml') + ' first!',
'',
'Example:',
'  deploy:',
'    type: github',
'    repository: <repository>',
'    branch: <branch>',
'',
'More info: https://github.com/tommy351/hexo/wiki',
];

console.log(help.join('\n') + '\n');
};

var deploy = function(){
var config = hexo.config.deploy,
deployDir = hexo.base_dir + '.deploy/',
publicDir = hexo.public_dir;

if (!config.repository || !config.branch) return displayHelp();

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
options: {cwd: deployDir},
exit: function(code){
if (code === 0) callback();
}
});
};

async.series([

function(next){
fs.exists(deployDir, function(exist){
if (exist) next();
else console.log('You have to use %s to setup deployment.', clc.bold('hexo setup_deploy'));
});
},

function(next){
console.log('Clearing.');
file.empty(deployDir, next);
},

function(next){
console.log('Copying files.');
fs.exists(publicDir, function(exist){
if (exist){
file.dir(publicDir, function(files){
async.forEach(files, function(item, next){
