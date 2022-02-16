var colors = require('colors'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../extend'),
util = require('../util'),
spawn = util.spawn,
gConfig = hexo.config;

var displayHelp = function(){
var help = [
'Example:',
'  deploy:',
'    type: rsync',
'    host: <host>',
'    user: <user>',
'    root: <root>',
'    port: [port] # Default is 22',
'    delete: [delete] # Default is true',
'',
'More info: http://zespia.tw/hexo/docs/deploy.html',
];

console.log(help.join('\n') + '\n');
};

var deploy = function(){
var config = gConfig.deploy;

if (!config.host || !config.user){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
return displayHelp();
}
if (!config.hasOwnProperty('delete')) config.delete = true;
if (!config.port) config.port = 22;

async.waterfall([

function(next){
fs.exists(hexo.public_dir, function(exist){
if (exist) next();
else console.log('You have to use %s to generate files first.', 'hexo generate'.bold);
});
},
function(next){
spawn({
command: 'rsync',
args: ['-avze', 'ssh -p ' + config.port, 'public/', config.user + '@' + config.host + ':' + config.root],
exit: function(code){
if (code === 0) next();
}
});
}
], function(){
