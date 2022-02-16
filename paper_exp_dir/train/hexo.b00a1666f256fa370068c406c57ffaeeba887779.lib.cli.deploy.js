var colors = require('colors'),
extend = require('../extend'),
list = extend.deployer.list(),
util = require('../util'),
spawn = util.spawn;

extend.console.register('deploy', 'Deploy', function(args){
var config = hexo.config.deploy;

if (!config || !config.type){
var help = '\nYou should configure deployment settings in ' + '_config.yml'.bold + ' first!\n\nType:\n';
help += '  ' + Object.keys(list).join(', ');
