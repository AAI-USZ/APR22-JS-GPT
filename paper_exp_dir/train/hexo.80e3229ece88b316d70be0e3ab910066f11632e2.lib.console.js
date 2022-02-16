var async = require('async'),
clc = require('cli-color'),
_ = require('underscore');

module.exports = function(command, args){
async.series([
function(next){
require('./config')(process.cwd(), next);
}
], function(){
var list = require('./extend').console.list(),
keys = Object.keys(list);

if (_.indexOf(keys, command) === -1){
var maxLen = 0,
result = '\nUsage: hexo <command>\n\nCommands:\n';

var helps = [
