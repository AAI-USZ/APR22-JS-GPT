var clc = require('cli-color'),
async = require('async'),
fs = require('graceful-fs'),
extend = require('../extend'),
util = require('../util'),
format = require('util').format,
spawn = util.spawn,
gConfig = hexo.config,
defaultRoot = '~/' + gConfig.url.replace(/^https?:\/\

var displayHelp = function(){
var help = [
'Example:',
'  deploy:',
'    type: rsync',
'    host: <host>',
'    user: <user>',
'    root: [root] # Default is ' + defaultRoot,
'    port: [port] # Default is 22',
'    delete: [delete] # Default is true',
'',
'More info: http://zespia.tw/hexo/docs/deploy.html',
];

console.log(help.join('\n') + '\n');
};

var command = function(comm, args, callback){
spawn({
command: comm,
args: args,
exit: function(code){
if (code === 0) callback();
}
});
};

var deploy = function(){
var config = gConfig.deploy;

if (!config.host || !config.user){
console.log('\nYou should configure deployment settings in %s first!\n', clc.bold('_config.yml'));
return displayHelp();
}
if (!config.hasOwnProperty('delete')) config.delete = true;
if (!config.port) config.port = 22;
if (!config.root) config.root = defaultRoot;

async.waterfall([

function(next){
fs.exists(hexo.public_dir, function(exist){
if (exist) next();
else console.log('You have to use %s to generate files first.', clc.bold('hexo generate'));
});
},
function(next){
fs.exists(hexo.base_dir + 'rsync-exclude', function(exist){
next(null, exist);
});
},
function(exist, next){
var exclude = exist ? '--exclude-from ' + hexo.base_dir + 'rsync-exclude' : '',
comm = format('ssh -p %s %s %s public/ %s@%s:%s', config.port, exclude, (config.delete ? '--delete' : ''), config.user, config.host, config.root);
console.log('Syncing.');
command('rsync', ['-avz', '-e', '"' + comm + '"']);
}
], function(){
console.log('Deploy complete.');
});
};

var setup = function(){
console.log('\nNo need to setup for rsync deployment. Just configure deployment settings in %s and run %s.\n', clc.bold('_config.yml'), clc.bold('hexo deploy'));
displayHelp();
};

extend.deployer.register('rsync', {
deploy: deploy,
setup: setup
});
