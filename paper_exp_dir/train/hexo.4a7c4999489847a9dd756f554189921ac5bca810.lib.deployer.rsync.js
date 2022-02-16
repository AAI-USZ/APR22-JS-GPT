var extend = require('../extend'),
colors = require('colors'),
util = require('../util'),
spawn = util.spawn,
config = hexo.config.deploy;

extend.deployer.register('rsync', function(){
if (!config.host || !config.user || !config.root){
console.log('\nYou should configure deployment settings in %s first!\n', '_config.yml'.bold);
console.log([
'Example:',
'  deploy:',
