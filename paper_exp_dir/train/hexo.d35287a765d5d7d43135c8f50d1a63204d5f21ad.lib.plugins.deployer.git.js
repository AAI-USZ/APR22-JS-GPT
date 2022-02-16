var async = require('async'),
fs = require('fs'),
path = require('path'),
moment = require('moment'),
spawn = require('child_process').spawn,
file = hexo.util.file2;

module.exports = function(args, callback){
var config = hexo.config.deploy,
baseDir = config.deploy_dir || hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;

if (!config.repo && !config.repository){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
'    type: git',
'    repo:',
'      github: <repository url>,<branch>',
'      gitcafe: <repository url>,<branch>',
'',
'For more help, you can check the docs: ' + 'http://zespia.tw/hexo/docs/deployment.html'.underline
];
console.log(help.join('\n'));
return callback();
}

var repo = config.repo || config.repository;

for (var t in repo){
var s = repo[t].split(',');
repo[t] = {};
repo[t].url = s[0];
repo[t].branch = s.length > 1 ? s[1] : 'master';
}

var run = function(command, args, callback){
var cp = spawn(command, args, {cwd: deployDir});
