var async = require('async'),
fs = require('graceful-fs'),
colors = require('colors'),
_ = require('lodash');

module.exports = function(args, callback){
var config = hexo.config.deploy,
log = hexo.log,
extend = hexo.extend,
deployer = extend.deployer.list();

if (!config){
var help = '';

help += 'You should configure deployment settings in _config.yml first!\n\n';
help += 'Available Types:\n';
help += '  ' + Object.keys(deployer).join(', ') + '\n\n';
help += 'For more help, you can check the online docs: ' + 'http://hexo.io/'.underline;

console.log(help);

return callback();
}
