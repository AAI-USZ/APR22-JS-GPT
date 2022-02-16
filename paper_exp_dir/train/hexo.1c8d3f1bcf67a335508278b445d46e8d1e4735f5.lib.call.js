var optimist = require('optimist'),
extend = require('./extend'),
console = extend.console.list();

module.exports = function(name, args, callback){
if (_.isFunction(args)){
