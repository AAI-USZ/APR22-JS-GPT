var tildify = require('tildify');
var chalk = require('chalk');

module.exports = function(args){

if (!args._.length){
return this.call('help', {_: ['publish']});
}

var self = this;

