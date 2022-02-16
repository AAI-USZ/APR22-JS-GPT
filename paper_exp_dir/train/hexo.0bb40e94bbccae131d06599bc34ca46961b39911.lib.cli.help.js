var clc = require('cli-color'),
_ = require('underscore');

module.exports = function(){
var maxLen = 0,
result = '\nUsage: hexo <command>\n\nOptions:\n';

var helps = [
['-v, version', 'Display version'],
['help', 'Display help'],
