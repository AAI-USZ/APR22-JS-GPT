var async = require('async'),
clc = require('cli-color'),
_ = require('underscore');

module.exports = function(command, safe, args){
async.series([
function(next){
require('./config')(process.cwd(), next);
},
function(next){
if (safe) next();
else require('./loader')(next);
}
], function(){
var list = require('./extend').console.list(),
keys = Object.keys(list);

if (_.indexOf(keys, command) === -1){
