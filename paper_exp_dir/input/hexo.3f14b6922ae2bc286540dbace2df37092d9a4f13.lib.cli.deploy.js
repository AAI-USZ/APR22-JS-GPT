var clc = require('cli-color'),
extend = require('../extend'),
list = extend.deploy.list();

extend.console.register('deploy', 'Deploy', function(args){
var config = hexo.config.deploy;

if (!config || !config.type){
help += '  ' + Object.keys(list).join(', ');
} else {
list[config.type].deploy(args);
}
});

extend.console.register('setup_deploy', 'Setup deployment', function(args){
var config = hexo.config.deploy;

if (!config || !config.type){
