var async = require('async'),
clc = require('cli-color'),
_ = require('underscore');

module.exports = function(command, args){
async.series([
function(next){
require('./config')(process.cwd(), next);
},
function(next){
require('./loader')(next);
}
], function(){
var list = require('./extend').console.list(),
