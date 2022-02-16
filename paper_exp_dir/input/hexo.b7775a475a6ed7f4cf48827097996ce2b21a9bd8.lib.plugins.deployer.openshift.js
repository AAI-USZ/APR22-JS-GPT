var extend = require('../../extend'),
async = require('async'),
fs = require('graceful-fs'),
util = require('../../util'),
file = util.file,
spawn = util.spawn,
config = hexo.config;

extend.deployer.register('openshift', function(args, callback){
if (!config.deploy.remote){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
return console.log([
'Example:',
'  deploy:',
'    type: openshift',
'    remote: <upstream git remote>',
'    branch: <upstraem git branch> (defaults to master)'
].join('\n') + '\n');
}

