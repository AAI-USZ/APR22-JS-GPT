var async = require('async'),
fs = require('graceful-fs'),
path = require('path'),
colors = require('colors'),
moment = require('moment'),
spawn = require('child_process').spawn,
util = require('../../util'),
file = util.file2;


var rRepo = /(:|\/)([^\/]+)\/([^\/]+)\.git\/?$/;

module.exports = function(args, callback){
var config = hexo.config.deploy,
baseDir = hexo.base_dir,
deployDir = path.join(baseDir, '.deploy'),
publicDir = hexo.public_dir;

if (!config.repo && !config.repository){
var help = [
'You should configure deployment settings in _config.yml first!',
'',
'Example:',
'  deploy:',
'    type: github',
'    repository: <repository url>',
'',
'For more help, you can check the docs: ' + 'http://zespia.tw/hexo/docs/deployment.html'.underline
];

console.log(help.join('\n'));
return callback();
}

var url = config.repo || config.repository;

if (!rRepo.test(url)){
hexo.log.e(url + ' is not a valid repository URL!');
return callback();
}

if (config.branch){
var branch = config.branch;
} else {
var match = url.match(rRepo),
username = match[2],
repo = match[3],
rGh = new RegExp('^' + username + '\.github\.[io|com]', 'i');


if (repo.match(rGh)){
var branch = 'master';
} else {
var branch = 'gh-pages'
}
}

var run = function(command, args, callback){
var cp = spawn(command, args, {cwd: deployDir});

cp.stdout.on('data', function(data){
process.stdout.write(data);
});

cp.stderr.on('data', function(data){
process.stderr.write(data);
});

cp.on('close', callback);
};

async.series([

function(next){
fs.exists(deployDir, function(exist){
if (exist && !args.setup) return next();

hexo.log.i('Setting up GitHub deployment...');

var commands = [
['init'],
['add', '-A', '.'],
