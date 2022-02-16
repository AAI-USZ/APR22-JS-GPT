var clc = require('cli-color'),
_ = require('underscore');

module.exports = function(){
var maxLen = 0,
result = '\nUsage: hexo <command>\n\nOptions:\n';

var helps = [
['-v, version', 'Display version'],
['help', 'Display help'],
['setup', 'Setup Hexo'],
['server', 'Run server'],
['generate', 'Generate static files'],
['deploy', 'Deploy'],
['new_post', 'Create new post'],
['new_page', 'Create new page']
];

_.each(helps, function(item){
var length = item[0].length;
if (maxLen < length) maxLen = length;
});

