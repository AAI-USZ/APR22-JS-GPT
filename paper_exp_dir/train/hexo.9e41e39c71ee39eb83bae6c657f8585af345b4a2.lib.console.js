var list = require('./extend').console.list(),
clc = require('cli-color'),
_ = require('underscore');

module.exports = function(command, args){
var keys = Object.keys(list);

if (_.indexOf(keys, command) === -1){
var maxLen = 0,
result = '\nUsage: hexo <command>\n\nCommands:\n';

var helps = [
['version', 'Display version'],
['help', 'Display help']
];

_.each(list, function(val, key){
helps.push([key, val.description]);
});

helps = helps.sort(function(a, b){
var orderA = a[0],
orderB = b[0];

if (orderA.length >= orderB.length) maxLen = orderA.length;
else maxLen = orderB.length;

if (orderA < orderB) return -1;
else if (orderA > orderB) return 1;
else return 0;
