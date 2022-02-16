var async = require('async'),
colors = require('colors'),
_ = require('underscore');

module.exports = function(command, argv){
async.series([
function(next){
require('./config')(process.cwd(), argv, next);
},
function(next){
if (argv.safe) next();
else require('./loader')(next);
}
], function(){
var list = require('./extend').console.list(),
init = hexo.config === {} ? false : true,
debug = hexo.debug;

_.each(list, function(val, key){
var options = val.options;
if ((init && !options.init) || (!debug && options.debug)){
delete list[key];
}
});


