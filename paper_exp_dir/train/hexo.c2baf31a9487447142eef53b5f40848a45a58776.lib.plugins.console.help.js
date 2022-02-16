var chalk = require('chalk');

module.exports = function(args){
var command = args._[0];
var list = this.extend.console.list();
var str = '';
var item, options;

if (list.hasOwnProperty(command) && command !== 'help'){
item = list[command];
